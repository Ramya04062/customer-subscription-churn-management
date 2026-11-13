
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.dto.DashboardSummaryDTO;
import com.churn.customer_churn_backend.dto.SnowflakeDashboardStatsDTO;
import com.churn.customer_churn_backend.entity.ExperimentStatus;
import com.churn.customer_churn_backend.entity.OutcomeStatus;
import com.churn.customer_churn_backend.repository.AssignmentRepository;
import com.churn.customer_churn_backend.repository.ExperimentOutcomeRepository;
import com.churn.customer_churn_backend.repository.ExperimentRepository;
import com.churn.customer_churn_backend.repository.SnowflakeCustomerRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;

@Service
public class DashboardService {

    private final SnowflakeCustomerRepository snowflakeRepository;
    private final ExperimentRepository experimentRepository;
    private final AssignmentRepository assignmentRepository;
    private final ExperimentOutcomeRepository outcomeRepository;

    public DashboardService(
            SnowflakeCustomerRepository snowflakeRepository,
            ExperimentRepository experimentRepository,
            AssignmentRepository assignmentRepository,
            ExperimentOutcomeRepository outcomeRepository) {

        this.snowflakeRepository = snowflakeRepository;
        this.experimentRepository = experimentRepository;
        this.assignmentRepository = assignmentRepository;
        this.outcomeRepository = outcomeRepository;
    }

    public DashboardSummaryDTO getDashboardSummary() throws SQLException {

        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        // 1. Customer statistics from Snowflake
        SnowflakeDashboardStatsDTO customerStats =
                snowflakeRepository.getDashboardStats();

        summary.setTotalCustomers(customerStats.getTotalCustomers());
        summary.setChurnedCustomers(customerStats.getChurnedCustomers());
        summary.setNonChurnedCustomers(customerStats.getNonChurnedCustomers());

        summary.setHighRiskCustomers(customerStats.getHighRiskCustomers());
        summary.setMediumRiskCustomers(customerStats.getMediumRiskCustomers());
        summary.setLowRiskCustomers(customerStats.getLowRiskCustomers());

        // Calculate overall churn rate
        long totalCustomers = customerStats.getTotalCustomers();
        long churnedCustomers = customerStats.getChurnedCustomers();

        BigDecimal churnRate = BigDecimal.ZERO;

        if (totalCustomers > 0) {
            churnRate = BigDecimal.valueOf(churnedCustomers)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            BigDecimal.valueOf(totalCustomers),
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        summary.setOverallChurnRate(churnRate);

        // 2. Experiment statistics from MySQL
        summary.setActiveExperiments(
                experimentRepository.countByStatus(ExperimentStatus.ACTIVE)
        );

        summary.setTotalRetained(
                outcomeRepository.countByOutcomeStatus(OutcomeStatus.RETAINED)
        );

        summary.setAssignedToExperiments(
                assignmentRepository.count()
        );

        return summary;
    }
}
