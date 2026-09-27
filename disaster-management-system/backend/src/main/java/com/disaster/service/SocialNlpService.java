package com.disaster.service;

import com.disaster.dto.SocialAnalyzeRequest;
import com.disaster.dto.SocialAnalyzeResponse;
import com.disaster.exception.NlpServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class SocialNlpService {

    private static final Logger log = LoggerFactory.getLogger(SocialNlpService.class);

    private final RestTemplate restTemplate;
    private final String nlpServiceUrl;

    @Autowired
    public SocialNlpService(
            @Value("${app.nlp.service-url:http://127.0.0.1:8000}") String nlpServiceUrl,
            @Value("${app.nlp.timeout-ms:10000}") int timeoutMs) {
        this.nlpServiceUrl = nlpServiceUrl.endsWith("/")
                ? nlpServiceUrl.substring(0, nlpServiceUrl.length() - 1)
                : nlpServiceUrl;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeoutMs);
        factory.setReadTimeout(timeoutMs);
        this.restTemplate = new RestTemplate(factory);
    }

    public SocialAnalyzeResponse analyzePost(SocialAnalyzeRequest request) {
        if (request == null || request.getText() == null || request.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Text content cannot be empty for analysis");
        }

        String url = nlpServiceUrl + "/api/analyze";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SocialAnalyzeRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<SocialAnalyzeResponse> response = restTemplate.postForEntity(url, entity, SocialAnalyzeResponse.class);

            if (response.getBody() == null) {
                log.error("Python NLP service returned empty body for url: {}", url);
                throw new NlpServiceException("Python NLP service returned empty response");
            }

            return response.getBody();
        } catch (ResourceAccessException e) {
            log.error("Python NLP service unavailable or timed out at {}: {}", url, e.getMessage());
            throw new NlpServiceException("Python NLP service is unavailable or timed out", e);
        } catch (HttpStatusCodeException e) {
            log.error("Python NLP service returned HTTP {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new NlpServiceException("Python NLP service returned error: " + e.getStatusCode(), e);
        } catch (RestClientException e) {
            log.error("Failed to call Python NLP service at {}: {}", url, e.getMessage());
            throw new NlpServiceException("Failed to communicate with Python NLP service: " + e.getMessage(), e);
        }
    }
}