package com.disaster.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialAnalyzeResponse {
    private String text;

    @JsonProperty("disaster_type")
    private String disasterType;

    private String location;

    @JsonProperty("emergency_score")
    private Integer emergencyScore;

    @JsonProperty("emergency_signals")
    private List<String> emergencySignals;

    private List<String> needs;

    private String severity;
}