package com.byebug.judge.consumer;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.byebug.judge.model.JudgeJob;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.service.JudgeService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class JudgeWorker implements CommandLineRunner {

    private final StringRedisTemplate stringRedisTemplate;
    private final JudgeService judgeService;
    private final ObjectMapper objectMapper;

    private static final String QUEUE_NAME = "judge-queue";

    @Override
    public void run(String... args) {
        startWorker();
    }

    public void startWorker() { //Tao luong rieng de chay worker
        new Thread(this::processQueue, "Judge-Worker-Thread").start();
    }

    private void processQueue() {
        log.info("Worker started listening on {}", QUEUE_NAME);

        while (!Thread.currentThread().isInterrupted()) {
            try {
                String message = stringRedisTemplate.opsForList().rightPop(QUEUE_NAME, 30, TimeUnit.SECONDS); //Lay request ra tu redis

                if (message != null) {
                    processMessage(message);
                }
            } catch (Exception e) {
                log.error("Worker encountered an error. Retrying in 3s...", e);

                try {
                    Thread.sleep(3000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    private void processMessage(String message) throws Exception {
        JudgeJob request = objectMapper.readValue(message, JudgeJob.class);
        Long submissionId = request.getSubmissionId();
        log.info("Received submission: {}", submissionId);

        try {
            //Cham bai
            JudgeResult result = judgeService.judge(submissionId);
            log.info("Judge result for {}: {}", submissionId, result.getStatus());
        } catch (Exception e) {
            stringRedisTemplate.opsForList().rightPush(QUEUE_NAME, message);
            log.error("Judge failed for submission {}. Requeued message on {}", submissionId, QUEUE_NAME, e);
            throw e;
        }
    }
}
