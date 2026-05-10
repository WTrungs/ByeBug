package com.byebug.judge.consumer;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.byebug.judge.model.JudgeRequest;
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
    private static final String RESULT_NAME = "result-queue";

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
                    log.info("Redis da duoc them du lieu!!!");
                    //Convert message sang JudgeRequest
                    JudgeRequest request = objectMapper.readValue(message, JudgeRequest.class);
                    log.info("Received submission: {}", request.getSubmissionId());
                    //Cham bai
                    JudgeResult result = judgeService.judge(request);
                    stringRedisTemplate.opsForList().leftPush(RESULT_NAME, objectMapper.writeValueAsString(result));
                    log.info("Judge result for {}: {}", request.getSubmissionId(), result.getStatus());
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
}