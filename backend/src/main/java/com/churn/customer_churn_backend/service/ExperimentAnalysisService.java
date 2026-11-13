
package com.churn.customer_churn_backend.service;

import com.churn.customer_churn_backend.entity.ExperimentAnalysisDTO;
import com.churn.customer_churn_backend.entity.GroupType;
import com.churn.customer_churn_backend.entity.OutcomeStatus;
import com.churn.customer_churn_backend.repository.AssignmentRepository;
import com.churn.customer_churn_backend.repository.ExperimentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class ExperimentAnalysisService {

    private final AssignmentRepository assignmentRepository;
    private final ExperimentRepository experimentRepository;

    public ExperimentAnalysisService(
            AssignmentRepository assignmentRepository,
            ExperimentRepository experimentRepository) {

        this.assignmentRepository = assignmentRepository;
        this.experimentRepository = experimentRepository;
    }

    @Transactional(readOnly = true)
    public List<ExperimentAnalysisDTO> analyzeExperiment(Long experimentId) {

        experimentRepository.findById(experimentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Experiment not found"));

        List<Object[]> results =
                assignmentRepository.getOutcomeCountsByExperimentId(experimentId);

        Map<GroupType, GroupCounts> groupCounts =
                new EnumMap<>(GroupType.class);

        for (GroupType groupType : GroupType.values()) {
            groupCounts.put(groupType, new GroupCounts());
        }

        for (Object[] row : results) {

            GroupType groupType = GroupType.valueOf(row[0].toString());

            Object statusValue = row[1];

            long count = ((Number) row[2]).longValue();

            GroupCounts counts = groupCounts.get(groupType);

            counts.totalAssigned += count;

            if (statusValue == null) {
                counts.pending += count;
                continue;
            }

            OutcomeStatus status =
                    OutcomeStatus.valueOf(statusValue.toString());

            switch (status) {

                case RETAINED:
                    counts.retained += count;
                    break;

                case CHURNED:
                    counts.churned += count;
                    break;

                case ENGAGEMENT_IMPROVED:
                    counts.engagementImproved += count;
                    break;

                case NO_RESPONSE:
                    counts.noResponse += count;
                    break;

                case PENDING:
                    counts.pending += count;
                    break;
            }
        }

        List<ExperimentAnalysisDTO> analysis = new ArrayList<>();

        for (GroupType groupType : GroupType.values()) {

            GroupCounts counts = groupCounts.get(groupType);

            long observedCustomers = counts.retained + counts.churned;

            BigDecimal churnRate = calculateRate(
                    counts.churned, observedCustomers);

            BigDecimal retentionRate = calculateRate(
                    counts.retained, observedCustomers);

            analysis.add(new ExperimentAnalysisDTO(
                    experimentId,
                    groupType,
                    counts.totalAssigned,
                    counts.retained,
                    counts.churned,
                    counts.engagementImproved,
                    counts.noResponse,
                    counts.pending,
                    churnRate,
                    retentionRate
            ));
        }

        return analysis;
    }

    private BigDecimal calculateRate(long count, long total) {

        if (total == 0) {
            return BigDecimal.ZERO.setScale(2);
        }

        return BigDecimal.valueOf(count)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }

    private static class GroupCounts {

        private long totalAssigned;
        private long retained;
        private long churned;
        private long engagementImproved;
        private long noResponse;
        private long pending;
    }
}
