
package com.churn.customer_churn_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "EXPERIMENT_OUTCOMES")
public class ExperimentOutcome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OUTCOME_ID")
    private Long outcomeId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSIGNMENT_ID", nullable = false, unique = true)
    private ExperimentAssignment assignment;

    @Enumerated(EnumType.STRING)
    @Column(name = "OUTCOME_STATUS", nullable = false)
    private OutcomeStatus outcomeStatus;

    @Column(name = "OBSERVED_AT")
    private LocalDateTime observedAt;

    @Column(name = "NOTES", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "CREATED_AT", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public ExperimentOutcome() {
    }

    public Long getOutcomeId() {
        return outcomeId;
    }

    public ExperimentAssignment getAssignment() {
        return assignment;
    }

    public void setAssignment(ExperimentAssignment assignment) {
        this.assignment = assignment;
    }

    public OutcomeStatus getOutcomeStatus() {
        return outcomeStatus;
    }

    public void setOutcomeStatus(OutcomeStatus outcomeStatus) {
        this.outcomeStatus = outcomeStatus;
    }

    public LocalDateTime getObservedAt() {
        return observedAt;
    }

    public void setObservedAt(LocalDateTime observedAt) {
        this.observedAt = observedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
