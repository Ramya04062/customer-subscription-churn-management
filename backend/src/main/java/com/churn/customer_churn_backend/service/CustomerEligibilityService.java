
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.dto.CustomerRiskDTO;
import com.churn.customer_churn_backend.repository.SnowflakeCustomerRepository;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerEligibilityService {

    private final SnowflakeCustomerRepository customerRepository;

    public CustomerEligibilityService(
            SnowflakeCustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerRiskDTO> findEligibleCustomers(int limit)
            throws SQLException {

        List<CustomerRiskDTO> customers =
                customerRepository.findAllCustomerRisks(limit);

        List<CustomerRiskDTO> eligibleCustomers = new ArrayList<>();

        for (CustomerRiskDTO customer : customers) {

            boolean notChurned =
                    "No".equalsIgnoreCase(customer.getChurn());

            boolean mediumOrHighRisk =
                    "Medium".equalsIgnoreCase(customer.getRiskLevel())
                            || "High".equalsIgnoreCase(customer.getRiskLevel());

            if (notChurned && mediumOrHighRisk) {
                eligibleCustomers.add(customer);
            }
        }

        return eligibleCustomers;
    }
}
