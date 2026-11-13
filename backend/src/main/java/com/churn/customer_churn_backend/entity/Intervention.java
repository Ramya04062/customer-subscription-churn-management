
package com.churn.customer_churn_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "INTERVENTIONS")
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INTERVENTION_ID")
    private Long interventionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXPERIMENT_ID", nullable = false)
    private Experiment experiment;

    @Column(name = "INTERVENTION_NAME", nullable = false, length = 150)
    private String interventionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "INTERVENTION_TYPE", nullable = false)
    private InterventionType interventionType;

    @Column(name = "DESCRIPTION", columnDefinition = "TEXT")
    private String description;

    @Column(name = "CREATED_AT", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Intervention() {
    }

    public Long getInterventionId() {
        return interventionId;
    }

    public Experiment getExperiment() {
        return experiment;
    }

    public void setExperiment(Experiment experiment) {
        this.experiment = experiment;
    }

    public String getInterventionName() {
        return interventionName;
    }

    public void setInterventionName(String interventionName) {
        this.interventionName = interventionName;
    }

    public InterventionType getInterventionType() {
        return interventionType;
    }

    public void setInterventionType(InterventionType interventionType) {
        this.interventionType = interventionType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
