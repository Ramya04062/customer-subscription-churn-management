
package com.churn.customer_churn_backend.repository;

import com.churn.customer_churn_backend.entity.ExperimentOutcome;
import com.churn.customer_churn_backend.entity.OutcomeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExperimentOutcomeRepository
        extends JpaRepository<ExperimentOutcome, Long> {

    boolean existsByAssignment_AssignmentId(Long assignmentId);

    Optional<ExperimentOutcome> findByAssignment_AssignmentId(Long assignmentId);

    List<ExperimentOutcome> findAllByAssignment_Experiment_ExperimentId(
            Long experimentId);

    long countByOutcomeStatus(OutcomeStatus outcomeStatus);
}
