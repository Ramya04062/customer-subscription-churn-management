
package com.churn.customer_churn_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CustomerRiskDTO {

    private Long userId;
    private LocalDate signupDate;
    private String planType;
    private BigDecimal monthlyFee;
    private BigDecimal avgWeeklyUsageHours;
    private Integer supportTickets;
    private Integer paymentFailures;
    private Integer tenureMonths;
    private Integer lastLoginDaysAgo;
    private String churn;
    private Integer lowUsage;
    private Integer paymentRisk;
    private Integer supportRisk;
    private Integer inactivityRisk;
    private Integer riskIndicatorCount;
    private String riskLevel;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getSignupDate() {
        return signupDate;
    }

    public void setSignupDate(LocalDate signupDate) {
        this.signupDate = signupDate;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public BigDecimal getMonthlyFee() {
        return monthlyFee;
    }

    public void setMonthlyFee(BigDecimal monthlyFee) {
        this.monthlyFee = monthlyFee;
    }

    public BigDecimal getAvgWeeklyUsageHours() {
        return avgWeeklyUsageHours;
    }

    public void setAvgWeeklyUsageHours(BigDecimal avgWeeklyUsageHours) {
        this.avgWeeklyUsageHours = avgWeeklyUsageHours;
    }

    public Integer getSupportTickets() {
        return supportTickets;
    }

    public void setSupportTickets(Integer supportTickets) {
        this.supportTickets = supportTickets;
    }

    public Integer getPaymentFailures() {
        return paymentFailures;
    }

    public void setPaymentFailures(Integer paymentFailures) {
        this.paymentFailures = paymentFailures;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public Integer getLastLoginDaysAgo() {
        return lastLoginDaysAgo;
    }

    public void setLastLoginDaysAgo(Integer lastLoginDaysAgo) {
        this.lastLoginDaysAgo = lastLoginDaysAgo;
    }

    public String getChurn() {
        return churn;
    }

    public void setChurn(String churn) {
        this.churn = churn;
    }

    public Integer getLowUsage() {
        return lowUsage;
    }

    public void setLowUsage(Integer lowUsage) {
        this.lowUsage = lowUsage;
    }

    public Integer getPaymentRisk() {
        return paymentRisk;
    }

    public void setPaymentRisk(Integer paymentRisk) {
        this.paymentRisk = paymentRisk;
    }

    public Integer getSupportRisk() {
        return supportRisk;
    }

    public void setSupportRisk(Integer supportRisk) {
        this.supportRisk = supportRisk;
    }

    public Integer getInactivityRisk() {
        return inactivityRisk;
    }

    public void setInactivityRisk(Integer inactivityRisk) {
        this.inactivityRisk = inactivityRisk;
    }

    public Integer getRiskIndicatorCount() {
        return riskIndicatorCount;
    }

    public void setRiskIndicatorCount(Integer riskIndicatorCount) {
        this.riskIndicatorCount = riskIndicatorCount;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}
