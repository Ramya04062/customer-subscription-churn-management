
package com.churn.customer_churn_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "EXPERIMENT_ASSIGNMENTS",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "UK_EXPERIMENT_USER",
                        columnNames = {"EXPERIMENT_ID", "USER_ID"}
                )
        }
)
public class ExperimentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSIGNMENT_ID")
    private Long assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXPERIMENT_ID", nullable = false)
    private Experiment experiment;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "GROUP_TYPE", nullable = false)
    private GroupType groupType;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private AssignmentStatus status = AssignmentStatus.SENT;

    @Column(name = "ASSIGNED_AT", insertable = false, updatable = false)
    private LocalDateTime assignedAt;

    public ExperimentAssignment() {
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public Experiment getExperiment() {
        return experiment;
    }

    public void setExperiment(Experiment experiment) {
        this.experiment = experiment;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public GroupType getGroupType() {
        return groupType;
    }

    public void setGroupType(GroupType groupType) {
        this.groupType = groupType;
    }

    public AssignmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssignmentStatus status) {
        this.status = status;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
}
