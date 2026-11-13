
package com.churn.customer_churn_backend.repository;

import com.churn.customer_churn_backend.config.SnowflakeConfig;
import com.churn.customer_churn_backend.dto.CustomerRiskDTO;
import com.churn.customer_churn_backend.dto.SnowflakeDashboardStatsDTO;

import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SnowflakeCustomerRepository {

    private final SnowflakeConfig snowflakeConfig;

    public SnowflakeCustomerRepository(SnowflakeConfig snowflakeConfig) {
        this.snowflakeConfig = snowflakeConfig;
    }

    public List<Long> findCustomerIds() throws SQLException {

        List<Long> customerIds = new ArrayList<>();

        String sql = """
                SELECT USER_ID
                FROM CUSTOMER_RISK
                ORDER BY USER_ID
                LIMIT 5
                """;

        try (Connection connection = snowflakeConfig.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                customerIds.add(resultSet.getLong("USER_ID"));
            }
        }

        return customerIds;
    }

    public List<CustomerRiskDTO> findAllCustomerRisks(int limit)
            throws SQLException {

        List<CustomerRiskDTO> customers = new ArrayList<>();

        String sql = """
                SELECT USER_ID, SIGNUP_DATE, PLAN_TYPE, MONTHLY_FEE,
                       AVG_WEEKLY_USAGE_HOURS, SUPPORT_TICKETS,
                       PAYMENT_FAILURES, TENURE_MONTHS, LAST_LOGIN_DAYS_AGO,
                       CHURN, LOW_USAGE, PAYMENT_RISK, SUPPORT_RISK,
                       INACTIVITY_RISK, RISK_INDICATOR_COUNT, RISK_LEVEL
                FROM CUSTOMER_RISK
                ORDER BY USER_ID
                LIMIT ?
                """;

        try (Connection connection = snowflakeConfig.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, limit);

            try (ResultSet resultSet = statement.executeQuery()) {

                while (resultSet.next()) {

                    CustomerRiskDTO customer = new CustomerRiskDTO();

                    customer.setUserId(resultSet.getLong("USER_ID"));

                    if (resultSet.getDate("SIGNUP_DATE") != null) {
                        customer.setSignupDate(
                                resultSet.getDate("SIGNUP_DATE").toLocalDate()
                        );
                    }

                    customer.setPlanType(resultSet.getString("PLAN_TYPE"));
                    customer.setMonthlyFee(resultSet.getBigDecimal("MONTHLY_FEE"));

                    customer.setAvgWeeklyUsageHours(
                            resultSet.getBigDecimal("AVG_WEEKLY_USAGE_HOURS")
                    );

                    customer.setSupportTickets(
                            getNullableInteger(resultSet, "SUPPORT_TICKETS")
                    );

                    customer.setPaymentFailures(
                            getNullableInteger(resultSet, "PAYMENT_FAILURES")
                    );

                    customer.setTenureMonths(
                            getNullableInteger(resultSet, "TENURE_MONTHS")
                    );

                    customer.setLastLoginDaysAgo(
                            getNullableInteger(resultSet, "LAST_LOGIN_DAYS_AGO")
                    );

                    customer.setChurn(resultSet.getString("CHURN"));

                    customer.setLowUsage(
                            getNullableInteger(resultSet, "LOW_USAGE")
                    );

                    customer.setPaymentRisk(
                            getNullableInteger(resultSet, "PAYMENT_RISK")
                    );

                    customer.setSupportRisk(
                            getNullableInteger(resultSet, "SUPPORT_RISK")
                    );

                    customer.setInactivityRisk(
                            getNullableInteger(resultSet, "INACTIVITY_RISK")
                    );

                    customer.setRiskIndicatorCount(
                            getNullableInteger(resultSet, "RISK_INDICATOR_COUNT")
                    );

                    customer.setRiskLevel(resultSet.getString("RISK_LEVEL"));

                    customers.add(customer);
                }
            }
        }

        return customers;
    }

    // Overview dashboard: aggregate statistics for all customers
    public SnowflakeDashboardStatsDTO getDashboardStats()
            throws SQLException {

        SnowflakeDashboardStatsDTO stats =
                new SnowflakeDashboardStatsDTO();

        String sql = """
                SELECT
                    COUNT(*) AS TOTAL_CUSTOMERS,

                    COALESCE(
                        COUNT_IF(UPPER(TRIM(CHURN)) = 'YES'), 0
                    ) AS CHURNED_CUSTOMERS,

                    COALESCE(
                        COUNT_IF(UPPER(TRIM(CHURN)) = 'NO'), 0
                    ) AS NON_CHURNED_CUSTOMERS,

                    COALESCE(
                        COUNT_IF(UPPER(TRIM(RISK_LEVEL)) = 'HIGH'), 0
                    ) AS HIGH_RISK_CUSTOMERS,

                    COALESCE(
                        COUNT_IF(UPPER(TRIM(RISK_LEVEL)) = 'MEDIUM'), 0
                    ) AS MEDIUM_RISK_CUSTOMERS,

                    COALESCE(
                        COUNT_IF(UPPER(TRIM(RISK_LEVEL)) = 'LOW'), 0
                    ) AS LOW_RISK_CUSTOMERS

                FROM CUSTOMER_RISK
                """;

        try (Connection connection = snowflakeConfig.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            if (resultSet.next()) {

                stats.setTotalCustomers(
                        resultSet.getLong("TOTAL_CUSTOMERS")
                );

                stats.setChurnedCustomers(
                        resultSet.getLong("CHURNED_CUSTOMERS")
                );

                stats.setNonChurnedCustomers(
                        resultSet.getLong("NON_CHURNED_CUSTOMERS")
                );

                stats.setHighRiskCustomers(
                        resultSet.getLong("HIGH_RISK_CUSTOMERS")
                );

                stats.setMediumRiskCustomers(
                        resultSet.getLong("MEDIUM_RISK_CUSTOMERS")
                );

                stats.setLowRiskCustomers(
                        resultSet.getLong("LOW_RISK_CUSTOMERS")
                );
            }
        }

        return stats;
    }

    private Integer getNullableInteger(
            ResultSet resultSet, String columnName
    ) throws SQLException {

        int value = resultSet.getInt(columnName);

        return resultSet.wasNull() ? null : value;
    }
}
