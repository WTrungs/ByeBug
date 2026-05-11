package com.byebug.judge.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.byebug.judge.model.JudgeRequest;
import com.byebug.judge.model.JudgeResult;
import com.byebug.judge.strategy.JudgeStrategy;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeService {

    private final Map<String, JudgeStrategy> strategies;

    public JudgeResult judge(JudgeRequest request) {
        JudgeStrategy strategy = strategies.get(request.getLanguage() + "JudgeStrategy");
        if (strategy == null) {
            JudgeResult result = new JudgeResult();
            result.setSubmissionId(request.getSubmissionId());
            result.setStatus("SE");
            result.setMessage("Unsupported language");
            return result;
        }
        return strategy.execute(request);
    }
    
}