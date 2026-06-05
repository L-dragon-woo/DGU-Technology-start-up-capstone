package com.dgu.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class OpenAiConfigController {

    @Value("${openai.api-key}")
    private String openAiApiKey;

    @GetMapping("/openai-key")
    public Map<String, String> getOpenAiKey() {
        return Map.of("apiKey", openAiApiKey);
    }
}