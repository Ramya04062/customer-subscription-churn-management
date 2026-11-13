
package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.InterventionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class InterventionRequest {

    @NotNull(message = "Experiment ID is required")
    @Positive(message = "Experiment ID must be positive")
    private Long experimentId;

    @NotBlank(message = "Intervention name is required")
    @Size(max = 150, message = "Intervention name cannot exceed 150 characters")
    private String interventionName;

    @NotNull(message = "Intervention type is required")
    private InterventionType interventionType;

    private String description;

    public Long getExperimentId() {
        return experimentId;
    }

    public void setExperimentId(Long experimentId) {
        this.experimentId = experimentId;
    }

    public String getInterventionName() {
        return interventionName;
    }

    public void setInterventionName(String interventionName) {
        this.interventionName = interventionName;
    }

    public InterventionType getInterventionType() {
        return interventionType;
    }

    public void setInterventionType(InterventionType interventionType) {
        this.interventionType = interventionType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
