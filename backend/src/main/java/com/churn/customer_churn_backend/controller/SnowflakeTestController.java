
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.dto.CustomerRiskDTO;
import com.churn.customer_churn_backend.repository.SnowflakeCustomerRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.churn.customer_churn_backend.service.CustomerEligibilityService;
import java.sql.SQLException;
import java.util.List;

@RestController
public class SnowflakeTestController {

    private final CustomerEligibilityService eligibilityService;
    private final SnowflakeCustomerRepository repository;

    public SnowflakeTestController(
            SnowflakeCustomerRepository repository,
            CustomerEligibilityService eligibilityService) {
        this.repository = repository;
        this.eligibilityService = eligibilityService;
    }

    @GetMapping("/api/snowflake/customers")
    public List<Long> getCustomerIds() throws SQLException {
        return repository.findCustomerIds();
    }

    @GetMapping("/api/snowflake/customer-risks")
    public List<CustomerRiskDTO> getCustomerRisks() throws SQLException {
        return repository.findAllCustomerRisks(20);
    }

    @GetMapping("/api/snowflake/eligible-customers")
    public List<CustomerRiskDTO> getEligibleCustomers() throws SQLException {
        return eligibilityService.findEligibleCustomers(20);
    }
}
