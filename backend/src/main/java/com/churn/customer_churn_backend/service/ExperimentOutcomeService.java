
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.dto.OutcomeRequest;
import com.churn.customer_churn_backend.dto.OutcomeResponse;

import com.churn.customer_churn_backend.entity.*;
import com.churn.customer_churn_backend.repository.AssignmentRepository;
import com.churn.customer_churn_backend.repository.ExperimentOutcomeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExperimentOutcomeService {

    private final ExperimentOutcomeRepository outcomeRepository;
    private final AssignmentRepository assignmentRepository;

    public ExperimentOutcomeService(
            ExperimentOutcomeRepository outcomeRepository,
            AssignmentRepository assignmentRepository) {

        this.outcomeRepository = outcomeRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Transactional
    public OutcomeResponse createOutcome(OutcomeRequest request) {

        ExperimentAssignment assignment =
                assignmentRepository.findById(request.getAssignmentId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Experiment assignment not found"));

        ExperimentStatus experimentStatus =
                assignment.getExperiment().getStatus();

        if (experimentStatus != ExperimentStatus.ACTIVE
                && experimentStatus != ExperimentStatus.COMPLETED) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Outcomes can only be recorded for active or completed experiments");
        }

        if (request.getOutcomeStatus() == OutcomeStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please provide a final outcome status");
        }

        if (outcomeRepository.existsByAssignment_AssignmentId(
                request.getAssignmentId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An outcome already exists for this assignment");
        }

        ExperimentOutcome outcome = new ExperimentOutcome();

        outcome.setAssignment(assignment);
        outcome.setOutcomeStatus(request.getOutcomeStatus());
        outcome.setObservedAt(LocalDateTime.now());

        ExperimentOutcome saved = outcomeRepository.save(outcome);

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OutcomeResponse> getAllOutcomes() {

        return outcomeRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OutcomeResponse getOutcomeById(Long outcomeId) {

        ExperimentOutcome outcome =
                outcomeRepository.findById(outcomeId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Experiment outcome not found"));

        return convertToResponse(outcome);
    }

    @Transactional(readOnly = true)
    public OutcomeResponse getOutcomeByAssignment(Long assignmentId) {

        ExperimentOutcome outcome =
                outcomeRepository.findByAssignment_AssignmentId(assignmentId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Outcome not found for this assignment"));

        return convertToResponse(outcome);
    }

    @Transactional(readOnly = true)
    public List<OutcomeResponse> getOutcomesByExperiment(Long experimentId) {

        return outcomeRepository
                .findAllByAssignment_Experiment_ExperimentId(experimentId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OutcomeResponse updateOutcome(
            Long outcomeId,
            OutcomeRequest request) {

        ExperimentOutcome outcome =
                outcomeRepository.findById(outcomeId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Experiment outcome not found"));

        if (!outcome.getAssignment().getAssignmentId()
                .equals(request.getAssignmentId())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assignment ID cannot be changed for an existing outcome");
        }

        if (request.getOutcomeStatus() == OutcomeStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please provide a final outcome status");
        }

        outcome.setOutcomeStatus(request.getOutcomeStatus());
        outcome.setObservedAt(LocalDateTime.now());

        ExperimentOutcome updated = outcomeRepository.save(outcome);

        return convertToResponse(updated);
    }

    @Transactional
    public void deleteOutcome(Long outcomeId) {

        ExperimentOutcome outcome =
                outcomeRepository.findById(outcomeId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Experiment outcome not found"));

        outcomeRepository.delete(outcome);
    }

    private OutcomeResponse convertToResponse(ExperimentOutcome outcome) {

        ExperimentAssignment assignment = outcome.getAssignment();

        return new OutcomeResponse(
                outcome.getOutcomeId(),
                assignment.getAssignmentId(),
                assignment.getExperiment().getExperimentId(),
                assignment.getUserId(),
                outcome.getOutcomeStatus(),
                outcome.getObservedAt(),
                outcome.getNotes(),
                outcome.getCreatedAt()
        );
    }
}
