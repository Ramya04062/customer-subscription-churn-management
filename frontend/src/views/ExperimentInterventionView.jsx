import React, { useEffect, useState } from 'react';

import {
    getExperiments,
    getInterventions
} from '../api/api';

import {
    Card,
    DataTable,
    EmptyState,
    Button,
    Icon
} from '../components/Shared';

function ExperimentsPage({
    refreshKey,
    onEdit,
    onDelete
}) {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isActive = true;

        async function loadExperiments() {
            try {
                setLoading(true);
                setError('');

                const data = await getExperiments();

                if (isActive) {
                    setExperiments(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (isActive) {
                    setError(err.message || 'Unable to load experiments.');
                }
            } finally {
                if (isActive) setLoading(false);
            }
        }

        loadExperiments();

        return () => {
            isActive = false;
        };
    }, [refreshKey]);

    const rows = experiments.map(experiment => [
        experiment.experimentName,
        experiment.objective || '—',
        experiment.startDate || '—',
        experiment.endDate || '—',
        experiment.status,
        <div
            className="experiment-row-actions"
            key={`experiment-${experiment.experimentId}`}
        >
            <button
                type="button"
                className="icon-button"
                title="Edit experiment"
                onClick={() => onEdit(experiment)}
            >
                <Icon name="edit" size={16} />
            </button>

            <button
                type="button"
                className="icon-button delete-icon-button"
                title="Delete experiment"
                onClick={() => onDelete(experiment)}
            >
                <Icon name="trash" size={16} />
            </button>
        </div>
    ]);

    return (
        <Card
            title="All experiments"
            subtitle="Experiments configured in this workspace"
        >
            {loading && <p>Loading experiments...</p>}

            {error && (
                <div className="notice">
                    <Icon name="warning" size={17} />
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && (
                <DataTable
                    headers={[
                        'Experiment name',
                        'Objective',
                        'Start date',
                        'End date',
                        'Status',
                        'Actions'
                    ]}
                    rows={rows}
                    badgeColumns={[4]}
                />
            )}
        </Card>
    );
}

function InterventionsPage({
    refreshKey,
    onEdit,
    onDelete
}) {
    const [interventions, setInterventions] = useState([]);
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isActive = true;

        async function loadData() {
            try {
                setLoading(true);
                setError('');

                const [interventionData, experimentData] =
                    await Promise.all([
                        getInterventions(),
                        getExperiments()
                    ]);

                if (isActive) {
                    setInterventions(
                        Array.isArray(interventionData)
                            ? interventionData
                            : []
                    );

                    setExperiments(
                        Array.isArray(experimentData)
                            ? experimentData
                            : []
                    );
                }
            } catch (err) {
                if (isActive) {
                    setError(
                        err.message || 'Unable to load interventions.'
                    );
                }
            } finally {
                if (isActive) setLoading(false);
            }
        }

        loadData();

        return () => {
            isActive = false;
        };
    }, [refreshKey]);

    const experimentNames = new Map(
        experiments.map(experiment => [
            Number(experiment.experimentId),
            experiment.experimentName
        ])
    );

    const rows = interventions.map(intervention => [
        intervention.interventionId,
        experimentNames.get(Number(intervention.experimentId)) ||
            `Experiment #${intervention.experimentId}`,
        intervention.interventionName,
        intervention.interventionType?.replaceAll('_', ' '),
        intervention.description || '—',
        intervention.createdAt
            ? new Date(intervention.createdAt).toLocaleDateString()
            : '—',
        <div
            className="experiment-row-actions"
            key={`intervention-${intervention.interventionId}`}
        >
            <button
                type="button"
                className="icon-button"
                title="Edit intervention"
                onClick={() => onEdit(intervention)}
            >
                <Icon name="edit" size={16} />
            </button>

            <button
                type="button"
                className="icon-button delete-icon-button"
                title="Delete intervention"
                onClick={() => onDelete(intervention)}
            >
                <Icon name="trash" size={16} />
            </button>
        </div>
    ]);

    return (
        <Card
            title="Intervention library"
            subtitle="Retention actions configured across experiments"
        >
            {loading && <p>Loading interventions...</p>}

            {error && (
                <div className="notice">
                    <Icon name="warning" size={17} />
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && interventions.length === 0 && (
                <EmptyState
                    title="No interventions found"
                    description="Create an intervention to start configuring retention actions."
                />
            )}

            {!loading && !error && interventions.length > 0 && (
                <DataTable
                    headers={[
                        'Intervention ID',
                        'Experiment',
                        'Intervention name',
                        'Type',
                        'Description',
                        'Created date',
                        'Actions'
                    ]}
                    rows={rows}
                />
            )}
        </Card>
    );
}

export default function ExperimentInterventionView({
    onCreateExperiment,
    onCreateIntervention,
    refreshKey,
    interventionsRefreshKey,
    onEditExperiment,
    onDeleteExperiment,
    onEditIntervention,
    onDeleteIntervention
}) {
    return (
        <div className="management-page">
            <section className="management-section">
                <div className="management-section-heading">
                    <div>
                        <h2>Experiments</h2>
                        <p>
                            Design and manage customer retention experiments
                        </p>
                    </div>

                    <Button
                        icon="plus"
                        onClick={onCreateExperiment}
                    >
                        Create experiment
                    </Button>
                </div>

                <ExperimentsPage
                    refreshKey={refreshKey}
                    onEdit={onEditExperiment}
                    onDelete={onDeleteExperiment}
                />
            </section>

            <section className="management-section">
                <div className="management-section-heading">
                    <div>
                        <h2>Interventions</h2>
                        <p>
                            Configure retention actions for treatment groups
                        </p>
                    </div>

                    <Button
                        icon="plus"
                        onClick={onCreateIntervention}
                    >
                        Create intervention
                    </Button>
                </div>

                <InterventionsPage
                    refreshKey={interventionsRefreshKey}
                    onEdit={onEditIntervention}
                    onDelete={onDeleteIntervention}
                />
            </section>
        </div>
    );
}