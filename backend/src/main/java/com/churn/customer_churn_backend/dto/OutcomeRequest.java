
package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.OutcomeStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OutcomeRequest {

    @NotNull(message = "Assignment ID is required")
    @Positive(message = "Assignment ID must be positive")
    private Long assignmentId;

    @NotNull(message = "Outcome status is required")
    private OutcomeStatus outcomeStatus;

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public OutcomeStatus getOutcomeStatus() {
        return outcomeStatus;
    }

    public void setOutcomeStatus(OutcomeStatus outcomeStatus) {
        this.outcomeStatus = outcomeStatus;
    }
}
