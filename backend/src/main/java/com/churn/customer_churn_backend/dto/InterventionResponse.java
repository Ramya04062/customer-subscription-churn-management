
package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.InterventionType;
import java.time.LocalDateTime;

public class InterventionResponse {

    private Long interventionId;
    private Long experimentId;
    private String interventionName;
    private InterventionType interventionType;
    private String description;
    private LocalDateTime createdAt;

    public InterventionResponse(
            Long interventionId,
            Long experimentId,
            String interventionName,
            InterventionType interventionType,
            String description,
            LocalDateTime createdAt) {

        this.interventionId = interventionId;
        this.experimentId = experimentId;
        this.interventionName = interventionName;
        this.interventionType = interventionType;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getInterventionId() {
        return interventionId;
    }

    public Long getExperimentId() {
        return experimentId;
    }

    public String getInterventionName() {
        return interventionName;
    }

    public InterventionType getInterventionType() {
        return interventionType;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
