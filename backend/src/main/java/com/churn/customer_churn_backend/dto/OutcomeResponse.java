
package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.OutcomeStatus;
import java.time.LocalDateTime;

public class OutcomeResponse {

    private Long outcomeId;
    private Long assignmentId;
    private Long experimentId;
    private Long userId;
    private OutcomeStatus outcomeStatus;
    private LocalDateTime observedAt;
    private String notes;
    private LocalDateTime createdAt;

    public OutcomeResponse(
            Long outcomeId,
            Long assignmentId,
            Long experimentId,
            Long userId,
            OutcomeStatus outcomeStatus,
            LocalDateTime observedAt,
            String notes,
            LocalDateTime createdAt) {

        this.outcomeId = outcomeId;
        this.assignmentId = assignmentId;
        this.experimentId = experimentId;
        this.userId = userId;
        this.outcomeStatus = outcomeStatus;
        this.observedAt = observedAt;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public Long getOutcomeId() {
        return outcomeId;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public Long getExperimentId() {
        return experimentId;
    }

    public Long getUserId() {
        return userId;
    }

    public OutcomeStatus getOutcomeStatus() {
        return outcomeStatus;
    }

    public LocalDateTime getObservedAt() {
        return observedAt;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
