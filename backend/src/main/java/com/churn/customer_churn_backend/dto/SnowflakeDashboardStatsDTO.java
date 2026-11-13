
package com.churn.customer_churn_backend.dto;

public class SnowflakeDashboardStatsDTO {

    private long totalCustomers;
    private long churnedCustomers;
    private long nonChurnedCustomers;
    private long highRiskCustomers;
    private long mediumRiskCustomers;
    private long lowRiskCustomers;

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
}
