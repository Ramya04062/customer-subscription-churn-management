
package com.churn.customer_churn_backend.controller;

import com.churn.customer_churn_backend.entity.ExperimentAnalysisDTO;
import com.churn.customer_churn_backend.service.ExperimentAnalysisService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentAnalysisController {

    private final ExperimentAnalysisService analysisService;

    public ExperimentAnalysisController(
            ExperimentAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/{experimentId}/analysis")
    public List<ExperimentAnalysisDTO> analyzeExperiment(
            @PathVariable Long experimentId) {

        return analysisService.analyzeExperiment(experimentId);
    }
}
