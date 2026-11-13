
import React, { useEffect, useMemo, useState } from 'react';

import {
    KpiCard,
    Card,
    EmptyState,
    DataTable,
    Button
} from '../components/Shared';

import {
    getExperiments,
    getAssignmentsByExperiment,
    autoAssignCustomers
} from '../api/api';

export default function AssignmentsView() {
    const [experiments, setExperiments] = useState([]);
    const [selectedExperimentId, setSelectedExperimentId] = useState('');

    const [assignments, setAssignments] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [groupFilter, setGroupFilter] = useState('ALL');

    const [loadingExperiments, setLoadingExperiments] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [assigning, setAssigning] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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
                setError(
                    err.message || 'Unable to load experiments.'
                );
            } finally {
                setLoadingExperiments(false);
            }
        };

        loadExperiments();
    }, []);

    // Load assignments whenever the selected experiment changes.
    useEffect(() => {
        if (!selectedExperimentId) {
            setAssignments([]);
            return;
        }

        let isMounted = true;

        const loadAssignments = async () => {
            try {
                setLoadingAssignments(true);
                setError('');
                setMessage('');

                const data = await getAssignmentsByExperiment(
                    selectedExperimentId
                );

                if (isMounted) {
                    setAssignments(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message || 'Unable to load assignments.'
                    );
                    setAssignments([]);
                }
            } finally {
                if (isMounted) {
                    setLoadingAssignments(false);
                }
            }
        };

        loadAssignments();

        return () => {
            isMounted = false;
        };
    }, [selectedExperimentId]);

    const selectedExperiment = experiments.find(
        experiment =>
            String(experiment.experimentId) === selectedExperimentId
    );

    // Calculate assignment statistics.
    const totalAssigned = assignments.length;

    const controlCount = assignments.filter(
        assignment => assignment.groupType === 'CONTROL'
    ).length;

    const treatmentCount = assignments.filter(
        assignment => assignment.groupType === 'TREATMENT'
    ).length;

    const controlPercentage = totalAssigned > 0
        ? (controlCount / totalAssigned) * 100
        : 0;

    const treatmentPercentage = totalAssigned > 0
        ? (treatmentCount / totalAssigned) * 100
        : 0;

    const groupDifference = Math.abs(controlCount - treatmentCount);

    const isBalanced = groupDifference <= 1;

    // Search and filter assignments.
    const filteredAssignments = useMemo(() => {
        return assignments.filter(assignment => {
            const matchesSearch =
                String(assignment.userId)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                String(assignment.assignmentId)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesGroup =
                groupFilter === 'ALL' ||
                assignment.groupType === groupFilter;

            return matchesSearch && matchesGroup;
        });
    }, [assignments, searchTerm, groupFilter]);

    // Automatically assign eligible customers.
    const handleAutoAssign = async () => {
        if (!selectedExperimentId) {
            setError('Please select an experiment first.');
            return;
        }

        try {
            setAssigning(true);
            setError('');
            setMessage('');

            const result = await autoAssignCustomers(
                selectedExperimentId
            );

            const refreshedAssignments =
                await getAssignmentsByExperiment(selectedExperimentId);

            setAssignments(
                Array.isArray(refreshedAssignments)
                    ? refreshedAssignments
                    : []
            );

            const newlyAssignedCount = Array.isArray(result)
                ? result.length
                : 0;

            setMessage(
                newlyAssignedCount > 0
                    ? `${newlyAssignedCount} customers assigned successfully.`
                    : 'No new eligible customers were available for assignment.'
            );
        } catch (err) {
            setError(
                err.message || 'Automatic customer assignment failed.'
            );
        } finally {
            setAssigning(false);
        }
    };

    const formatDate = date => {
        if (!date) return '—';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return '—';
        }

        return parsedDate.toLocaleDateString();
    };

    // Prepare table rows, including assignment status.
    const rows = filteredAssignments.map(assignment => [
        assignment.assignmentId,
        assignment.userId,
        selectedExperiment?.experimentName || '—',
        assignment.groupType,
        assignment.status || '—',
        formatDate(assignment.assignedAt)
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
                            setGroupFilter('ALL');
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

                <Button
                    icon="users"
                    onClick={handleAutoAssign}
                    disabled={
                        !selectedExperimentId ||
                        assigning ||
                        loadingAssignments ||
                        selectedExperiment?.status !== 'ACTIVE'
                    }
                >
                    {assigning
                        ? 'Assigning customers...'
                        : 'Auto assign customers'}
                </Button>
            </div>

            {/* Loading and Error Messages */}
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

            {/* Assignment Statistics */}
            <div className="kpi-grid three">
                <KpiCard
                    label="Total assigned customers"
                    value={loadingAssignments ? '...' : totalAssigned}
                    icon="users"
                />

                <KpiCard
                    label="Control group"
                    value={loadingAssignments ? '...' : controlCount}
                    icon="assigned"
                    tone="blue"
                />

                <KpiCard
                    label="Treatment group"
                    value={loadingAssignments ? '...' : treatmentCount}
                    icon="assigned"
                    tone="purple"
                />
            </div>

            {/* Assignment Distribution and Health */}
            <div className="grid-2 assignments-summary">

                <Card
                    title="Assignment distribution"
                    subtitle="CONTROL versus TREATMENT allocation"
                >
                    {loadingAssignments ? (
                        <EmptyState title="Loading assignment distribution..." />
                    ) : totalAssigned === 0 ? (
                        <EmptyState
                            title="No assignment distribution available"
                            description="Run automatic assignment to allocate eligible customers."
                        />
                    ) : (
                        <div className="assignment-distribution">
                            <div className="distribution-label">
                                <span>Control</span>
                                <strong>
                                    {controlCount} ({controlPercentage.toFixed(1)}%)
                                </strong>
                            </div>

                            <div className="distribution-track">
                                <div
                                    className="distribution-control"
                                    style={{
                                        width: `${controlPercentage}%`
                                    }}
                                />
                            </div>

                            <div className="distribution-label">
                                <span>Treatment</span>
                                <strong>
                                    {treatmentCount} ({treatmentPercentage.toFixed(1)}%)
                                </strong>
                            </div>

                            <div className="distribution-track">
                                <div
                                    className="distribution-treatment"
                                    style={{
                                        width: `${treatmentPercentage}%`
                                    }}
                                />
                            </div>

                            <p className="distribution-total">
                                Total: {totalAssigned} assigned customers
                            </p>
                        </div>
                    )}
                </Card>

                <Card
                    title="Assignment health"
                    subtitle="Control and treatment group allocation check"
                >
                    {loadingAssignments ? (
                        <EmptyState title="Checking assignment health..." />
                    ) : totalAssigned === 0 ? (
                        <EmptyState
                            title="No assignment checks available"
                            description="Assignment health will be available after customers are assigned."
                        />
                    ) : (
                        <div className="assignment-health">
                            <div className="health-status">
                                <span
                                    className={`health-indicator ${
                                        isBalanced ? 'healthy' : 'warning'
                                    }`}
                                />

                                <strong>
                                    {isBalanced
                                        ? 'Balanced allocation'
                                        : 'Uneven allocation'}
                                </strong>
                            </div>

                            <p>
                                {isBalanced
                                    ? 'The difference between the control and treatment groups is within one customer.'
                                    : `The control and treatment groups differ by ${groupDifference} customers.`}
                            </p>

                            <div className="health-details">
                                <div>
                                    <span>Control customers</span>
                                    <strong>{controlCount}</strong>
                                </div>

                                <div>
                                    <span>Treatment customers</span>
                                    <strong>{treatmentCount}</strong>
                                </div>

                                <div>
                                    <span>Group difference</span>
                                    <strong>{groupDifference}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

            </div>

            {/* Customer Assignments Table */}
            <Card
                title="Customer assignments"
                subtitle={
                    selectedExperiment
                        ? `Customers assigned to ${selectedExperiment.experimentName}`
                        : 'Customers assigned to the selected experiment'
                }
            >
                <div className="filters">
                    <label className="search-box">
                        <span>⌕</span>

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
                                value={groupFilter}
                                onChange={event =>
                                    setGroupFilter(event.target.value)
                                }
                            >
                                <option value="ALL">All groups</option>
                                <option value="CONTROL">Control</option>
                                <option value="TREATMENT">Treatment</option>
                            </select>

                            <span className="select-caret">⌄</span>
                        </label>
                    </div>
                </div>

                {loadingAssignments ? (
                    <EmptyState title="Loading customer assignments..." />
                ) : (
                    <DataTable
                        headers={[
                            'Assignment ID',
                            'Customer ID',
                            'Experiment name',
                            'Group type',
                            'Status',
                            'Assigned date'
                        ]}
                        rows={rows}
                        badgeColumns={[3, 4]}
                    />
                )}

                {!loadingAssignments &&
                    assignments.length > 0 &&
                    filteredAssignments.length === 0 && (
                        <p className="empty-filter-message">
                            No assignments match your search or group filter.
                        </p>
                    )}
            </Card>
        </>
    );
}
