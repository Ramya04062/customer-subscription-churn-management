
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.entity.Experiment;
import com.churn.customer_churn_backend.service.ExperimentService;
import org.springframework.web.bind.annotation.*;
import com.churn.customer_churn_backend.dto.ExperimentRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

    private final ExperimentService experimentService;

    public ExperimentController(ExperimentService experimentService) {
        this.experimentService = experimentService;
    }

    @GetMapping
    public List<Experiment> getAllExperiments() {
        return experimentService.getAllExperiments();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Experiment createExperiment(
            @Valid @RequestBody ExperimentRequest request) {

        return experimentService.createExperiment(request);
    }

    @GetMapping("/{id}")
    public Experiment getExperimentById(@PathVariable Long id) {
        return experimentService.getExperimentById(id);
    }


    @PutMapping("/{id}")
    public Experiment updateExperiment(
            @PathVariable Long id,
            @Valid @RequestBody ExperimentRequest request) {

        return experimentService.updateExperiment(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperiment(@PathVariable Long id) {

        experimentService.deleteExperiment(id);

        return ResponseEntity.noContent().build();
    }



}
