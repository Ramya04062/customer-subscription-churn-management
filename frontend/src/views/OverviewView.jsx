
import React, { useEffect, useState } from 'react';

import {
    Card,
    KpiCard,
    Button,
    EmptyState,
    Select
} from '../components/Shared';

import {
    getDashboardSummary,
    getExperiments,
    getExperimentAnalysis
} from '../api/api';

export default function OverviewView({ navigate }) {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [experiments, setExperiments] = useState([]);
    const [selectedExperiment, setSelectedExperiment] = useState('');
    const [analysis, setAnalysis] = useState([]);
    const [experimentsLoading, setExperimentsLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState('');

    // Load dashboard metrics
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getDashboardSummary();

                setDashboard(data);

            } catch (err) {
                setError(err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // Load experiments
    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                setExperimentsLoading(true);

                const data = await getExperiments();
                const experimentList = Array.isArray(data) ? data : [];

                setExperiments(experimentList);

                if (experimentList.length > 0) {
                    setSelectedExperiment(
                        String(experimentList[0].experimentId)
                    );
                }

            } catch (err) {
                setAnalysisError(
                    err.message || 'Unable to load experiments'
                );
            } finally {
                setExperimentsLoading(false);
            }
        };

        fetchExperiments();
    }, []);

    // Load selected experiment analysis
    useEffect(() => {
        if (!selectedExperiment) {
            setAnalysis([]);
            return;
        }

        let cancelled = false;

        const fetchAnalysis = async () => {
            try {
                setAnalysisLoading(true);
                setAnalysisError('');
                setAnalysis([]);

                const data = await getExperimentAnalysis(selectedExperiment);

                if (!cancelled) {
                    setAnalysis(Array.isArray(data) ? data : []);
                }

            } catch (err) {
                if (!cancelled) {
                    setAnalysisError(
                        err.message || 'Unable to load experiment analysis'
                    );
                }
            } finally {
                if (!cancelled) {
                    setAnalysisLoading(false);
                }
            }
        };

        fetchAnalysis();

        return () => {
            cancelled = true;
        };
    }, [selectedExperiment]);

    const formatNumber = (value) =>
        Number(value || 0).toLocaleString('en-IN');

    const formatPercentage = (value) =>
        `${Number(value || 0).toFixed(2)}%`;

    const getGroupLabel = (groupType) => {
        if (groupType === 'CONTROL') return 'Control Group';
        if (groupType === 'TREATMENT') return 'Treatment Group';
        return groupType || 'Unknown Group';
    };

    return (
        <div className="overview-page">

            {/* OVERVIEW */}
            <section className="overview-section">

                <div className="overview-section-heading">
                    <h2>Overview</h2>
                    <p>
                        Overall customer retention and experiment performance
                    </p>
                </div>

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <div className="kpi-grid six">

                    <KpiCard
                        label="Total customers"
                        value={loading ? '...' : formatNumber(dashboard?.totalCustomers)}
                        icon="users"
                    />

                    <KpiCard
                        label="Overall churn rate"
                        value={loading ? '...' : formatPercentage(dashboard?.overallChurnRate)}
                        icon="trend"
                        tone="red"
                    />

                    <KpiCard
                        label="High-risk customers"
                        value={loading ? '...' : formatNumber(dashboard?.highRiskCustomers)}
                        icon="warning"
                        tone="amber"
                    />

                    <KpiCard
                        label="Active experiments"
                        value={loading ? '...' : formatNumber(dashboard?.activeExperiments)}
                        icon="flask"
                        tone="purple"
                    />

                    <KpiCard
                        label="Total retained"
                        value={loading ? '...' : formatNumber(dashboard?.totalRetained)}
                        icon="retained"
                        tone="green"
                    />

                    <KpiCard
                        label="Assigned to experiments"
                        value={loading ? '...' : formatNumber(dashboard?.assignedToExperiments)}
                        icon="assigned"
                        tone="blue"
                    />

                </div>
            </section>

            {/* CUSTOMER ANALYTICS */}
            <section className="overview-section">

                <div className="overview-section-heading">
                    <h2>Customer Analytics</h2>
                    <p>
                        Customer churn, risk distribution, and customer insights
                    </p>
                </div>

                <Card
                    title="Customer analytics"
                    subtitle="Customer distribution based on Snowflake data"
                >

                    {loading ? (
                        <EmptyState title="Loading customer analytics..." />
                    ) : error ? (
                        <EmptyState title="Customer analytics could not be loaded" />
                    ) : (
                        <div className="kpi-grid three">

                            <KpiCard
                                label="Churned customers"
                                value={formatNumber(dashboard?.churnedCustomers)}
                                icon="trend"
                                tone="red"
                            />

                            <KpiCard
                                label="Non-churned customers"
                                value={formatNumber(dashboard?.nonChurnedCustomers)}
                                icon="users"
                                tone="green"
                            />

                            <KpiCard
                                label="High-risk customers"
                                value={formatNumber(dashboard?.highRiskCustomers)}
                                icon="warning"
                                tone="amber"
                            />

                            <KpiCard
                                label="Medium-risk customers"
                                value={formatNumber(dashboard?.mediumRiskCustomers)}
                                icon="warning"
                                tone="amber"
                            />

                            <KpiCard
                                label="Low-risk customers"
                                value={formatNumber(dashboard?.lowRiskCustomers)}
                                icon="users"
                                tone="blue"
                            />

                        </div>
                    )}

                </Card>
            </section>

            {/* EXPERIMENT ANALYSIS */}
            <section className="overview-section">

                <div className="overview-section-heading">
                    <h2>Experiment Analysis</h2>
                    <p>
                        Compare control and treatment group effectiveness
                    </p>
                </div>

                <Card
                    title="Experiment performance"
                    subtitle="Compare outcomes between experiment groups"
                >

                    {experimentsLoading ? (
                        <EmptyState title="Loading experiments..." />
                    ) : experiments.length === 0 ? (
                        <>
                            <EmptyState
                                title="No experiments available"
                            />

                            <Button
                                variant="secondary"
                                onClick={() => navigate('management')}
                            >
                                Manage experiments
                            </Button>
                        </>
                    ) : (
                        <>

                            {/* Experiment selection */}
                            <div className="experiment-selector">
                                <label htmlFor="overview-experiment">
                                    Select experiment
                                </label>

                                <Select
                                    id="overview-experiment"
                                    value={selectedExperiment}
                                    onChange={(e) => setSelectedExperiment(e.target.value)}
                                >
                                    {experiments.map((experiment) => (
                                        <option
                                            key={experiment.experimentId}
                                            value={String(experiment.experimentId)}
                                        >
                                            {experiment.experimentName}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {analysisLoading ? (
                                <EmptyState title="Loading experiment analysis..." />
                            ) : analysisError ? (
                                <EmptyState title={analysisError} />
                            ) : analysis.length === 0 ? (
                                <EmptyState
                                    title="No analysis data available for this experiment"
                                />
                            ) : (

                                <div className="experiment-analysis-groups">

                                    {analysis.map((group) => (
                                        <div
                                            className="experiment-analysis-group"
                                            key={group.groupType}
                                        >

                                            <h3>
                                                {getGroupLabel(group.groupType)}
                                            </h3>

                                            <div className="experiment-kpi-grid">

                                                <KpiCard
                                                    label="Total assigned"
                                                    value={formatNumber(group.totalAssigned)}
                                                    icon="assigned"
                                                />

                                                <KpiCard
                                                    label="Retained"
                                                    value={formatNumber(group.retained)}
                                                    icon="retained"
                                                    tone="green"
                                                />

                                                <KpiCard
                                                    label="Churned"
                                                    value={formatNumber(group.churned)}
                                                    icon="trend"
                                                    tone="red"
                                                />

                                                <KpiCard
                                                    label="Retention rate"
                                                    value={formatPercentage(group.retentionRate)}
                                                    icon="retained"
                                                    tone="green"
                                                />

                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}

                        </>
                    )}

                </Card>
            </section>

        </div>
    );
}
