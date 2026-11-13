
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.dto.OutcomeRequest;
import com.churn.customer_churn_backend.dto.OutcomeResponse;
import com.churn.customer_churn_backend.service.ExperimentOutcomeService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outcomes")
public class ExperimentOutcomeController {

    private final ExperimentOutcomeService outcomeService;

    public ExperimentOutcomeController(
            ExperimentOutcomeService outcomeService) {
        this.outcomeService = outcomeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OutcomeResponse createOutcome(
            @Valid @RequestBody OutcomeRequest request) {

        return outcomeService.createOutcome(request);
    }

    @GetMapping
    public List<OutcomeResponse> getAllOutcomes() {
        return outcomeService.getAllOutcomes();
    }

    @GetMapping("/{id}")
    public OutcomeResponse getOutcomeById(
            @PathVariable Long id) {

        return outcomeService.getOutcomeById(id);
    }

    @GetMapping("/assignment/{assignmentId}")
    public OutcomeResponse getOutcomeByAssignment(
            @PathVariable Long assignmentId) {

        return outcomeService.getOutcomeByAssignment(assignmentId);
    }

    @GetMapping("/experiment/{experimentId}")
    public List<OutcomeResponse> getOutcomesByExperiment(
            @PathVariable Long experimentId) {

        return outcomeService.getOutcomesByExperiment(experimentId);
    }

    @PutMapping("/{id}")
    public OutcomeResponse updateOutcome(
            @PathVariable Long id,
            @Valid @RequestBody OutcomeRequest request) {

        return outcomeService.updateOutcome(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOutcome(@PathVariable Long id) {
        outcomeService.deleteOutcome(id);
    }
}
