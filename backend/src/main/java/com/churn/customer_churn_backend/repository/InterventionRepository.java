
package com.churn.customer_churn_backend.repository;

import com.churn.customer_churn_backend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterventionRepository
        extends JpaRepository<Intervention, Long> {

    List<Intervention> findByExperiment_ExperimentId(Long experimentId);
}
