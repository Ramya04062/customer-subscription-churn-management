package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.ExperimentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ExperimentRequest {

    @NotBlank(message = "Experiment name is required")
    @Size(max = 150, message = "Experiment name cannot exceed 150 characters")
    private String experimentName;

    private String description;

    @Size(max = 255, message = "Objective cannot exceed 255 characters")
    private String objective;

    private LocalDate startDate;

    private LocalDate endDate;

    private ExperimentStatus status;

    public String getExperimentName() {
        return experimentName;
    }

    public ExperimentStatus getStatus() {
        return status;
    }

    public void setStatus(ExperimentStatus status) {
        this.status = status;
    }

    public void setExperimentName(String experimentName) {
        this.experimentName = experimentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}