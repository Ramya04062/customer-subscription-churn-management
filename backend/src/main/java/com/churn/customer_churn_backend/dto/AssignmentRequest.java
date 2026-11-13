
package com.churn.customer_churn_backend.dto;

import com.churn.customer_churn_backend.entity.GroupType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AssignmentRequest {

    @NotNull(message = "Experiment ID is required")
    @Positive(message = "Experiment ID must be positive")
    private Long experimentId;

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userId;

    @NotNull(message = "Group type is required")
    private GroupType groupType;

    public Long getExperimentId() {
        return experimentId;
    }

    public void setExperimentId(Long experimentId) {
        this.experimentId = experimentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public GroupType getGroupType() {
        return groupType;
    }

    public void setGroupType(GroupType groupType) {
        this.groupType = groupType;
    }
}
