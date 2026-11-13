
package com.churn.customer_churn_backend.repository;

import com.churn.customer_churn_backend.entity.Experiment;
import com.churn.customer_churn_backend.entity.ExperimentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperimentRepository extends JpaRepository<Experiment, Long> {
    long countByStatus(ExperimentStatus status);
}
