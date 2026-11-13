
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.dto.InterventionRequest;
import com.churn.customer_churn_backend.dto.InterventionResponse;
import com.churn.customer_churn_backend.entity.Experiment;
import com.churn.customer_churn_backend.entity.Intervention;
import com.churn.customer_churn_backend.repository.ExperimentRepository;
import com.churn.customer_churn_backend.repository.InterventionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.List;

@Service
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final ExperimentRepository experimentRepository;


    public InterventionService(
            InterventionRepository interventionRepository,
            ExperimentRepository experimentRepository) {

        this.interventionRepository = interventionRepository;
        this.experimentRepository = experimentRepository;
    }

    @Transactional
    public InterventionResponse createIntervention(
            InterventionRequest request) {

        Experiment experiment = experimentRepository
                .findById(request.getExperimentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found"
                ));

        Intervention intervention = new Intervention();

        intervention.setExperiment(experiment);
        intervention.setInterventionName(request.getInterventionName());
        intervention.setInterventionType(request.getInterventionType());
        intervention.setDescription(request.getDescription());

        Intervention saved = interventionRepository.save(intervention);

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InterventionResponse> getAllInterventions() {

        return interventionRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InterventionResponse getInterventionById(Long id) {

        Intervention intervention = interventionRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Intervention not found"
                ));

        return convertToResponse(intervention);
    }

    @Transactional(readOnly = true)
    public List<InterventionResponse> getInterventionsByExperiment(
            Long experimentId) {

        if (!experimentRepository.existsById(experimentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Experiment not found"
            );
        }

        return interventionRepository
                .findByExperiment_ExperimentId(experimentId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private InterventionResponse convertToResponse(
            Intervention intervention) {

        return new InterventionResponse(
                intervention.getInterventionId(),
                intervention.getExperiment().getExperimentId(),
                intervention.getInterventionName(),
                intervention.getInterventionType(),
                intervention.getDescription(),
                intervention.getCreatedAt()
        );
    }

    @Transactional
    public InterventionResponse updateIntervention(
            Long id,
            InterventionRequest request) {

        Intervention intervention = interventionRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Intervention not found"
                ));

        Experiment experiment = experimentRepository
                .findById(request.getExperimentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found"
                ));

        intervention.setExperiment(experiment);
        intervention.setInterventionName(request.getInterventionName());
        intervention.setInterventionType(request.getInterventionType());
        intervention.setDescription(request.getDescription());

        Intervention updated = interventionRepository.save(intervention);

        return convertToResponse(updated);
    }

    @Transactional
    public void deleteIntervention(Long id) {

        Intervention intervention = interventionRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Intervention not found"
                ));

        try {
            interventionRepository.delete(intervention);
            interventionRepository.flush();

        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete this intervention because it is associated with other records."
            );
        }
    }


}
