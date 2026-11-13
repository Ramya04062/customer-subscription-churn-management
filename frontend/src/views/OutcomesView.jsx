
import React, { useEffect, useMemo, useState } from 'react';

import {
    KpiCard,
    Card,
    EmptyState,
    DataTable,
    Button,
    Icon
} from '../components/Shared';

import Modal from '../components/Modal';

import {
    getExperiments,
    getAssignmentsByExperiment,
    getOutcomesByExperiment,
    createOutcome,
    updateOutcome,
    deleteOutcome
} from '../api/api';

const OUTCOME_STATUSES = [
    'RETAINED',
    'CHURNED',
    'ENGAGEMENT_IMPROVED',
    'NO_RESPONSE',
    'PENDING'
];

export default function OutcomesView() {
    const [experiments, setExperiments] = useState([]);
    const [selectedExperimentId, setSelectedExperimentId] = useState('');

    const [assignments, setAssignments] = useState([]);
    const [outcomes, setOutcomes] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [groupFilter, setGroupFilter] = useState('ALL');

    const [loadingExperiments, setLoadingExperiments] = useState(true);
    const [loadingOutcomes, setLoadingOutcomes] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [modal, setModal] = useState(null);

    // Load experiments when the page opens.
    useEffect(() => {
        const loadExperiments = async () => {
            try {
                setLoadingExperiments(true);
                setError('');

                const data = await getExperiments();
                const experimentList = Array.isArray(data) ? data : [];

                setExperiments(experimentList);

                if (experimentList.length > 0) {
                    setSelectedExperimentId(
                        String(experimentList[0].experimentId)
                    );
                }
            } catch (err) {
                setError(err.message || 'Unable to load experiments.');
            } finally {
                setLoadingExperiments(false);
            }
        };

        loadExperiments();
    }, []);

    // Load assignments and outcomes for the selected experiment.
    useEffect(() => {
        if (!selectedExperimentId) {
            setAssignments([]);
            setOutcomes([]);
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            try {
                setLoadingOutcomes(true);
                setError('');

                const [assignmentData, outcomeData] = await Promise.all([
                    getAssignmentsByExperiment(selectedExperimentId),
                    getOutcomesByExperiment(selectedExperimentId)
                ]);

                if (isMounted) {
                    setAssignments(
                        Array.isArray(assignmentData) ? assignmentData : []
                    );

                    setOutcomes(
                        Array.isArray(outcomeData) ? outcomeData : []
                    );
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message || 'Unable to load experiment outcomes.'
                    );

                    setAssignments([]);
                    setOutcomes([]);
                }
            } finally {
                if (isMounted) {
                    setLoadingOutcomes(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [selectedExperimentId]);

    const selectedExperiment = experiments.find(
        experiment =>
            String(experiment.experimentId) === selectedExperimentId
    );

    // Match outcomes with their assignment information.
    const enrichedOutcomes = useMemo(() => {
        return outcomes.map(outcome => {
            const assignment = assignments.find(
                item =>
                    String(item.assignmentId) ===
                    String(outcome.assignmentId)
            );

            return {
                ...outcome,
                groupType: assignment?.groupType || '—'
            };
        });
    }, [outcomes, assignments]);

    // Calculate outcome statistics.
    const totalOutcomes = outcomes.length;

    const retainedCount = outcomes.filter(
        outcome => outcome.outcomeStatus === 'RETAINED'
    ).length;

    const churnedCount = outcomes.filter(
        outcome => outcome.outcomeStatus === 'CHURNED'
    ).length;

    const engagementImprovedCount = outcomes.filter(
        outcome => outcome.outcomeStatus === 'ENGAGEMENT_IMPROVED'
    ).length;

    const noResponseCount = outcomes.filter(
        outcome => outcome.outcomeStatus === 'NO_RESPONSE'
    ).length;

    const pendingCount = outcomes.filter(
        outcome => outcome.outcomeStatus === 'PENDING'
    ).length;

    // Search and filter outcomes.
    const filteredOutcomes = useMemo(() => {
        return enrichedOutcomes.filter(outcome => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                String(outcome.userId ?? '')
                    .toLowerCase()
                    .includes(search) ||
                String(outcome.assignmentId ?? '')
                    .toLowerCase()
                    .includes(search) ||
                String(outcome.outcomeId ?? '')
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === 'ALL' ||
                outcome.outcomeStatus === statusFilter;

            const matchesGroup =
                groupFilter === 'ALL' ||
                outcome.groupType === groupFilter;

            return matchesSearch && matchesStatus && matchesGroup;
        });
    }, [enrichedOutcomes, searchTerm, statusFilter, groupFilter]);

    const formatDate = date => {
        if (!date) return '—';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return '—';
        }

        return parsedDate.toLocaleString();
    };

    const formatStatus = status => {
        if (!status) return '—';

        return status
            .replaceAll('_', ' ')
            .toLowerCase()
            .replace(/\b\w/g, character => character.toUpperCase());
    };

    // Refresh assignments and outcomes after an operation.
    const refreshData = async () => {
        const [assignmentData, outcomeData] = await Promise.all([
            getAssignmentsByExperiment(selectedExperimentId),
            getOutcomesByExperiment(selectedExperimentId)
        ]);

        setAssignments(
            Array.isArray(assignmentData) ? assignmentData : []
        );

        setOutcomes(
            Array.isArray(outcomeData) ? outcomeData : []
        );
    };

    // Open the Record Outcome modal.
    const handleRecordOutcome = () => {
        setError('');
        setMessage('');

        setModal({
            type: 'outcome',
            initialData: null
        });
    };

    // Open the Edit Outcome modal.
    const handleEditOutcome = outcome => {
        setError('');
        setMessage('');

        setModal({
            type: 'editOutcome',
            initialData: outcome
        });
    };

    // Close modal.
    const closeModal = () => {
        setModal(null);
    };

    // Create or update an outcome.
    const handleModalSubmit = async form => {
        try {
            setError('');
            setMessage('');

            const outcomeData = {
                assignmentId: Number(form.assignmentId),
                outcomeStatus: form.status
            };

            if (modal.type === 'editOutcome') {
                await updateOutcome(
                    modal.initialData.outcomeId,
                    outcomeData
                );

                setMessage('Outcome updated successfully.');
            } else {
                await createOutcome(outcomeData);

                setMessage('Outcome recorded successfully.');
            }

            closeModal();
            await refreshData();
        } catch (err) {
            setError(err.message || 'Unable to save outcome.');
        }
    };

    // Delete an outcome without deleting its assignment.
    const handleDeleteOutcome = async outcome => {
        const confirmed = window.confirm(
            `Are you sure you want to delete outcome #${outcome.outcomeId}?`
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            await deleteOutcome(outcome.outcomeId);

            await refreshData();

            setMessage('Outcome deleted successfully.');
        } catch (err) {
            setError(err.message || 'Unable to delete outcome.');
        }
    };

    // Table rows with edit and delete icon actions.
    const rows = filteredOutcomes.map(outcome => [
        outcome.outcomeId,
        outcome.assignmentId,
        outcome.userId,
        selectedExperiment?.experimentName || '—',
        outcome.groupType,
        formatStatus(outcome.outcomeStatus),
        formatDate(outcome.observedAt),
        outcome.notes || '—',
        <div
            key={outcome.outcomeId}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            <button
                type="button"
                title="Edit outcome"
                aria-label="Edit outcome"
                onClick={() => handleEditOutcome(outcome)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    border: '1px solid #dbe1ea',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer'
                }}
            >
                <Icon name="edit" size={16} />
            </button>

            <button
                type="button"
                title="Delete outcome"
                aria-label="Delete outcome"
                onClick={() => handleDeleteOutcome(outcome)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    border: '1px solid #f0caca',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: '#dc5252',
                    cursor: 'pointer'
                }}
            >
                <Icon name="trash" size={16} />
            </button>
        </div>
    ]);

    return (
        <>
            {/* Experiment Selection */}
            <div className="selector-row">
                <label className="select-wrap">
                    <span>Experiment</span>

                    <select
                        value={selectedExperimentId}
                        onChange={event => {
                            setSelectedExperimentId(event.target.value);
                            setSearchTerm('');
                            setStatusFilter('ALL');
                            setGroupFilter('ALL');
                            setMessage('');
                            setError('');
                        }}
                        disabled={
                            loadingExperiments || experiments.length === 0
                        }
                    >
                        <option value="">
                            {loadingExperiments
                                ? 'Loading experiments...'
                                : 'Select an experiment'}
                        </option>

                        {experiments.map(experiment => (
                            <option
                                key={experiment.experimentId}
                                value={experiment.experimentId}
                            >
                                {experiment.experimentName}
                            </option>
                        ))}
                    </select>

                    <span className="select-caret">⌄</span>
                </label>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* Outcome Statistics */}
            <div className="kpi-grid six compact">
                <KpiCard
                    label="Total outcomes"
                    value={loadingOutcomes ? '...' : totalOutcomes}
                    icon="outcomes"
                />

                <KpiCard
                    label="Retained"
                    value={loadingOutcomes ? '...' : retainedCount}
                    icon="retained"
                    tone="green"
                />

                <KpiCard
                    label="Churned"
                    value={loadingOutcomes ? '...' : churnedCount}
                    icon="warning"
                    tone="red"
                />

                <KpiCard
                    label="Engagement improved"
                    value={loadingOutcomes ? '...' : engagementImprovedCount}
                    icon="trend"
                    tone="blue"
                />

                <KpiCard
                    label="No response"
                    value={loadingOutcomes ? '...' : noResponseCount}
                    icon="customers"
                    tone="purple"
                />

                <KpiCard
                    label="Pending"
                    value={loadingOutcomes ? '...' : pendingCount}
                    icon="calendar"
                    tone="amber"
                />
            </div>

            {/* Customer Outcomes Table */}
            <Card
                title="Customer outcomes"
                subtitle={
                    selectedExperiment
                        ? `Observed customer behavior for ${selectedExperiment.experimentName}`
                        : 'Observed customer behavior after experiment assignment'
                }
                action={
                    <Button
                        icon="plus"
                        onClick={handleRecordOutcome}
                        disabled={
                            !selectedExperimentId ||
                            (
                                selectedExperiment?.status !== 'ACTIVE' &&
                                selectedExperiment?.status !== 'COMPLETED'
                            )
                        }
                    >
                        Record Outcome
                    </Button>
                }
            >
                <div className="filters">
                    <label className="search-box">
                        <Icon name="search" size={16} />

                        <input
                            type="text"
                            placeholder="Search customer or assignment ID..."
                            value={searchTerm}
                            onChange={event =>
                                setSearchTerm(event.target.value)
                            }
                        />
                    </label>

                    <div className="filter-group">
                        <label className="select-wrap">
                            <select
                                value={statusFilter}
                                onChange={event =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <option value="ALL">All outcomes</option>

                                {OUTCOME_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {formatStatus(status)}
                                    </option>
                                ))}
                            </select>

                            <span className="select-caret">⌄</span>
                        </label>

                        <label className="select-wrap">
                            <select
                                value={groupFilter}
                                onChange={event =>
                                    setGroupFilter(event.target.value)
                                }
                            >
                                <option value="ALL">All group types</option>
                                <option value="CONTROL">Control</option>
                                <option value="TREATMENT">Treatment</option>
                            </select>

                            <span className="select-caret">⌄</span>
                        </label>
                    </div>
                </div>

                {loadingOutcomes ? (
                    <EmptyState title="Loading customer outcomes..." />
                ) : (
                    <DataTable
                        headers={[
                            'Outcome ID',
                            'Assignment ID',
                            'Customer ID',
                            'Experiment',
                            'Group',
                            'Outcome status',
                            'Observed at',
                            'Notes',
                            'Actions'
                        ]}
                        rows={rows}
                        badgeColumns={[4, 5]}
                    />
                )}

                {!loadingOutcomes &&
                    outcomes.length > 0 &&
                    filteredOutcomes.length === 0 && (
                        <p className="empty-filter-message">
                            No outcomes match your search or selected filters.
                        </p>
                    )}
            </Card>

            {/* Record / Edit Outcome Modal */}
            {modal && (
                <Modal
                    type={modal.type}
                    initialData={modal.initialData}
                    close={closeModal}
                    submit={handleModalSubmit}
                />
            )}
        </>
    );
}
