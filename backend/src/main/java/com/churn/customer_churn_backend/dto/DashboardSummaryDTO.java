
package com.churn.customer_churn_backend.dto;

import java.math.BigDecimal;

public class DashboardSummaryDTO {

    // Customer metrics from Snowflake
    private long totalCustomers;
    private long churnedCustomers;
    private long nonChurnedCustomers;
    private BigDecimal overallChurnRate;

    private long highRiskCustomers;
    private long mediumRiskCustomers;
    private long lowRiskCustomers;

    // Experiment metrics from MySQL
    private long activeExperiments;
    private long totalRetained;
    private long assignedToExperiments;

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getChurnedCustomers() {
        return churnedCustomers;
    }

    public void setChurnedCustomers(long churnedCustomers) {
        this.churnedCustomers = churnedCustomers;
    }

    public long getNonChurnedCustomers() {
        return nonChurnedCustomers;
    }

    public void setNonChurnedCustomers(long nonChurnedCustomers) {
        this.nonChurnedCustomers = nonChurnedCustomers;
    }

    public BigDecimal getOverallChurnRate() {
        return overallChurnRate;
    }

    public void setOverallChurnRate(BigDecimal overallChurnRate) {
        this.overallChurnRate = overallChurnRate;
    }

    public long getHighRiskCustomers() {
        return highRiskCustomers;
    }

    public void setHighRiskCustomers(long highRiskCustomers) {
        this.highRiskCustomers = highRiskCustomers;
    }

    public long getMediumRiskCustomers() {
        return mediumRiskCustomers;
    }

    public void setMediumRiskCustomers(long mediumRiskCustomers) {
        this.mediumRiskCustomers = mediumRiskCustomers;
    }

    public long getLowRiskCustomers() {
        return lowRiskCustomers;
    }

    public void setLowRiskCustomers(long lowRiskCustomers) {
        this.lowRiskCustomers = lowRiskCustomers;
    }

    public long getActiveExperiments() {
        return activeExperiments;
    }

    public void setActiveExperiments(long activeExperiments) {
        this.activeExperiments = activeExperiments;
    }

    public long getTotalRetained() {
        return totalRetained;
    }

    public void setTotalRetained(long totalRetained) {
        this.totalRetained = totalRetained;
    }

    public long getAssignedToExperiments() {
        return assignedToExperiments;
    }

    public void setAssignedToExperiments(long assignedToExperiments) {
        this.assignedToExperiments = assignedToExperiments;
    }
}
