
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.entity.Experiment;
import com.churn.customer_churn_backend.repository.ExperimentRepository;
import org.springframework.stereotype.Service;
import com.churn.customer_churn_backend.dto.ExperimentRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import com.churn.customer_churn_backend.entity.ExperimentStatus;

@Service
public class ExperimentService {

    private final ExperimentRepository experimentRepository;

    public ExperimentService(ExperimentRepository experimentRepository) {
        this.experimentRepository = experimentRepository;
    }

    public List<Experiment> getAllExperiments() {
        return experimentRepository.findAll();
    }


    public Experiment createExperiment(ExperimentRequest request) {

        Experiment experiment = new Experiment();

        experiment.setExperimentName(request.getExperimentName());
        experiment.setDescription(request.getDescription());
        experiment.setObjective(request.getObjective());
        experiment.setStartDate(request.getStartDate());
        experiment.setEndDate(request.getEndDate());

        if (request.getStartDate() != null &&
                request.getEndDate() != null &&
                request.getEndDate().isBefore(request.getStartDate())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be earlier than start date"
            );
        }

        return experimentRepository.save(experiment);
    }

    public Experiment getExperimentById(Long id) {

        return experimentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found with ID: " + id
                ));
    }

    public Experiment updateExperiment(Long id, ExperimentRequest request) {

        Experiment experiment = experimentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found with ID: " + id
                ));

        if (request.getStartDate() != null &&
                request.getEndDate() != null &&
                request.getEndDate().isBefore(request.getStartDate())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be earlier than start date"
            );
        }

        experiment.setExperimentName(request.getExperimentName());
        experiment.setDescription(request.getDescription());
        experiment.setObjective(request.getObjective());
        experiment.setStartDate(request.getStartDate());
        experiment.setEndDate(request.getEndDate());

        if (request.getStatus() != null) {
            experiment.setStatus(request.getStatus());
        }

        return experimentRepository.save(experiment);
    }


    public void deleteExperiment(Long id) {

        Experiment experiment = experimentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found with ID: " + id
                ));

        if (experiment.getStatus() != ExperimentStatus.DRAFT) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only DRAFT experiments can be deleted"
            );
        }

        experimentRepository.delete(experiment);
    }


}
