
package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.GroupType;
import com.churn.customer_churn_backend.entity.AssignmentStatus;

import java.time.LocalDateTime;

public class AssignmentResponse {

    private Long assignmentId;
    private Long experimentId;
    private Long userId;
    private GroupType groupType;
    private AssignmentStatus status;
    private LocalDateTime assignedAt;

    public AssignmentResponse(
            Long assignmentId,
            Long experimentId,
            Long userId,
            GroupType groupType,
            AssignmentStatus status,
            LocalDateTime assignedAt) {

        this.assignmentId = assignmentId;
        this.experimentId = experimentId;
        this.userId = userId;
        this.groupType = groupType;
        this.status = status;
        this.assignedAt = assignedAt;
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

    public GroupType getGroupType() {
        return groupType;
    }

    public AssignmentStatus getStatus() {
        return status;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
}
