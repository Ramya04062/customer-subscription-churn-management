
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.dto.InterventionRequest;
import com.churn.customer_churn_backend.dto.InterventionResponse;
import com.churn.customer_churn_backend.service.InterventionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
public class InterventionController {

    private final InterventionService interventionService;

    public InterventionController(
            InterventionService interventionService) {
        this.interventionService = interventionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterventionResponse createIntervention(
            @Valid @RequestBody InterventionRequest request) {

        return interventionService.createIntervention(request);
    }

    @GetMapping
    public List<InterventionResponse> getAllInterventions() {
        return interventionService.getAllInterventions();
    }

    @GetMapping("/{id}")
    public InterventionResponse getInterventionById(
            @PathVariable Long id) {

        return interventionService.getInterventionById(id);
    }

    @GetMapping("/experiment/{experimentId}")
    public List<InterventionResponse> getInterventionsByExperiment(
            @PathVariable Long experimentId) {

        return interventionService
                .getInterventionsByExperiment(experimentId);
    }

    @PutMapping("/{id}")
    public InterventionResponse updateIntervention(
            @PathVariable Long id,
            @Valid @RequestBody InterventionRequest request) {

        return interventionService.updateIntervention(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIntervention(@PathVariable Long id) {
        interventionService.deleteIntervention(id);
    }
}
