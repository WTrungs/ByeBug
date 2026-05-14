package com.group5.byebug.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeQueueProducer {
    private static final String QUEUE_NAME = "judge-queue";

    private final StringRedisTemplate stringRedisTemplate;

    public void enqueue(Long submissionId) {
        stringRedisTemplate.opsForList().leftPush(QUEUE_NAME, "{\"submissionId\":" + submissionId + "}");
    }
}
