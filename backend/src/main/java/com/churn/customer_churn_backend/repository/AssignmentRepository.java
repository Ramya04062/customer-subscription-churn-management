
package com.churn.customer_churn_backend.repository;

import com.churn.customer_churn_backend.entity.ExperimentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssignmentRepository
        extends JpaRepository<ExperimentAssignment, Long> {

    boolean existsByExperiment_ExperimentIdAndUserId(
            Long experimentId, Long userId);

    List<ExperimentAssignment> findByExperiment_ExperimentId(
            Long experimentId);



    @Query(value = """
    SELECT
        ea.GROUP_TYPE,
        eo.OUTCOME_STATUS,
        COUNT(*) AS CUSTOMER_COUNT
    FROM experiment_assignments ea
    LEFT JOIN experiment_outcomes eo
        ON ea.ASSIGNMENT_ID = eo.ASSIGNMENT_ID
    WHERE ea.EXPERIMENT_ID = :experimentId
    GROUP BY ea.GROUP_TYPE, eo.OUTCOME_STATUS
    ORDER BY ea.GROUP_TYPE, eo.OUTCOME_STATUS
    """, nativeQuery = true)

    List<Object[]> getOutcomeCountsByExperimentId(
            @Param("experimentId") Long experimentId);

}
