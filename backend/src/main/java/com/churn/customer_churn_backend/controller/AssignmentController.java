
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.dto.AssignmentRequest;
import com.churn.customer_churn_backend.dto.AssignmentResponse;
import com.churn.customer_churn_backend.service.AssignmentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentResponse createAssignment(
            @Valid @RequestBody AssignmentRequest request) {

        return assignmentService.createAssignment(request);
    }

    @GetMapping
    public List<AssignmentResponse> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @GetMapping("/{id}")
    public AssignmentResponse getAssignmentById(
            @PathVariable Long id) {

        return assignmentService.getAssignmentById(id);
    }

    @GetMapping("/experiment/{experimentId}")
    public List<AssignmentResponse> getAssignmentsByExperiment(
            @PathVariable Long experimentId) {

        return assignmentService.getAssignmentsByExperiment(experimentId);
    }


    @PostMapping("/experiment/{experimentId}/auto-assign")
    @ResponseStatus(HttpStatus.CREATED)
    public List<AssignmentResponse> autoAssignCustomers(
            @PathVariable Long experimentId) throws SQLException {

        return assignmentService.assignEligibleCustomers(experimentId);
    }

}
