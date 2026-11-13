
package com.churn.customer_churn_backend.entity;

import com.churn.customer_churn_backend.entity.GroupType;
import java.math.BigDecimal;

public class ExperimentAnalysisDTO {

    private Long experimentId;
    private GroupType groupType;

    private long totalAssigned;
    private long retained;
    private long churned;
    private long engagementImproved;
    private long noResponse;
    private long pending;

    private BigDecimal churnRate;
    private BigDecimal retentionRate;

    public ExperimentAnalysisDTO(
            Long experimentId,
            GroupType groupType,
            long totalAssigned,
            long retained,
            long churned,
            long engagementImproved,
            long noResponse,
            long pending,
            BigDecimal churnRate,
            BigDecimal retentionRate) {

        this.experimentId = experimentId;
        this.groupType = groupType;
        this.totalAssigned = totalAssigned;
        this.retained = retained;
        this.churned = churned;
        this.engagementImproved = engagementImproved;
        this.noResponse = noResponse;
        this.pending = pending;
        this.churnRate = churnRate;
        this.retentionRate = retentionRate;
    }

    public Long getExperimentId() {
        return experimentId;
    }

    public GroupType getGroupType() {
        return groupType;
    }

    public long getTotalAssigned() {
        return totalAssigned;
    }

    public long getRetained() {
        return retained;
    }

    public long getChurned() {
        return churned;
    }

    public long getEngagementImproved() {
        return engagementImproved;
    }

    public long getNoResponse() {
        return noResponse;
    }

    public long getPending() {
        return pending;
    }

    public BigDecimal getChurnRate() {
        return churnRate;
    }

    public BigDecimal getRetentionRate() {
        return retentionRate;
    }
}
