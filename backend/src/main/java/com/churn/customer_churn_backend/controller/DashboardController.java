
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.dto.DashboardSummaryDTO;
import com.churn.customer_churn_backend.service.DashboardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryDTO getDashboardSummary() throws SQLException {
        return dashboardService.getDashboardSummary();
    }
}
