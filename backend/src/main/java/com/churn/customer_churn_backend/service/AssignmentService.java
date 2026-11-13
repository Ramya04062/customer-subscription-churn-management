
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.dto.AssignmentRequest;
import com.churn.customer_churn_backend.dto.AssignmentResponse;
import com.churn.customer_churn_backend.dto.CustomerRiskDTO;
import com.churn.customer_churn_backend.entity.Experiment;
import com.churn.customer_churn_backend.entity.ExperimentAssignment;
import com.churn.customer_churn_backend.entity.ExperimentStatus;
import com.churn.customer_churn_backend.entity.GroupType;
import com.churn.customer_churn_backend.repository.AssignmentRepository;
import com.churn.customer_churn_backend.repository.ExperimentRepository;
import com.churn.customer_churn_backend.service.CustomerEligibilityService;
import com.churn.customer_churn_backend.entity.AssignmentStatus;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ExperimentRepository experimentRepository;
    private final CustomerEligibilityService eligibilityService;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            ExperimentRepository experimentRepository, CustomerEligibilityService eligibilityService) {

        this.assignmentRepository = assignmentRepository;
        this.experimentRepository = experimentRepository;
        this.eligibilityService=eligibilityService;

    }

    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request) {

        Experiment experiment = experimentRepository
                .findById(request.getExperimentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found"
                ));

        if (experiment.getStatus() == ExperimentStatus.COMPLETED ||
                experiment.getStatus() == ExperimentStatus.CANCELLED) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot assign customers to a completed or cancelled experiment"
            );
        }

        if (assignmentRepository.existsByExperiment_ExperimentIdAndUserId(
                request.getExperimentId(), request.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Customer is already assigned to this experiment"
            );
        }

        ExperimentAssignment assignment = new ExperimentAssignment();

        assignment.setExperiment(experiment);
        assignment.setUserId(request.getUserId());
        assignment.setGroupType(request.getGroupType());
        assignment.setStatus(AssignmentStatus.SENT);

        ExperimentAssignment saved =
                assignmentRepository.save(assignment);

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments() {

        return assignmentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(Long id) {

        ExperimentAssignment assignment = assignmentRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assignment not found"
                ));

        return convertToResponse(assignment);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByExperiment(
            Long experimentId) {

        if (!experimentRepository.existsById(experimentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Experiment not found"
            );
        }

        return assignmentRepository
                .findByExperiment_ExperimentId(experimentId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    @Transactional
    public List<AssignmentResponse> assignEligibleCustomers(Long experimentId)
            throws java.sql.SQLException {

        // 1. Find the experiment
        Experiment experiment = experimentRepository
                .findById(experimentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found"
                ));

        // 2. Only ACTIVE experiments accept bulk assignments
        if (experiment.getStatus() != ExperimentStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only active experiments can receive customer assignments"
            );
        }

        // 3. Retrieve existing assignments
        List<ExperimentAssignment> existingAssignments =
                assignmentRepository.findByExperiment_ExperimentId(experimentId);

        // Track previously assigned customers
        java.util.Set<Long> assignedUserIds = new java.util.HashSet<>();

        // Track existing group counts
        int controlCount = 0;
        int treatmentCount = 0;

        for (ExperimentAssignment assignment : existingAssignments) {

            assignedUserIds.add(assignment.getUserId());

            if (assignment.getGroupType() == GroupType.CONTROL) {
                controlCount++;
            } else {
                treatmentCount++;
            }
        }

        // 4. Retrieve eligible customers from Snowflake
        List<CustomerRiskDTO> eligibleCustomers =
                eligibilityService.findEligibleCustomers(20);

        // 5. Remove customers already assigned to this experiment
        eligibleCustomers.removeIf(
                customer -> assignedUserIds.contains(customer.getUserId())
        );

        // 6. Randomize customer order
        java.util.Collections.shuffle(eligibleCustomers);

        // 7. Assign customers to balanced groups
        List<AssignmentResponse> responses = new java.util.ArrayList<>();

        for (CustomerRiskDTO customer : eligibleCustomers) {

            GroupType groupType;

            if (controlCount <= treatmentCount) {
                groupType = GroupType.CONTROL;
                controlCount++;
            } else {
                groupType = GroupType.TREATMENT;
                treatmentCount++;
            }

            ExperimentAssignment assignment = new ExperimentAssignment();

            assignment.setExperiment(experiment);
            assignment.setUserId(customer.getUserId());
            assignment.setGroupType(groupType);
            assignment.setStatus(AssignmentStatus.SENT);

            ExperimentAssignment saved =
                    assignmentRepository.save(assignment);

            responses.add(convertToResponse(saved));
        }

        return responses;
    }


    private AssignmentResponse convertToResponse(
            ExperimentAssignment assignment) {

        return new AssignmentResponse(
                assignment.getAssignmentId(),
                assignment.getExperiment().getExperimentId(),
                assignment.getUserId(),
                assignment.getGroupType(),
                assignment.getStatus(),
                assignment.getAssignedAt()
        );
    }
}
