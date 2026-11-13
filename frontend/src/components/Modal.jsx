
import React, { useEffect, useState } from 'react';
import { Button, Icon } from './Shared';
import { getExperiments } from '../api/api';

const experimentStatuses = [
    'DRAFT',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
];

const interventionTypes = [
    'PAYMENT_REMINDER',
    'DISCOUNT',
    'CONTENT_RECOMMENDATION',
    'RE_ENGAGEMENT'
];

const outcomeStatuses = [
    'RETAINED',
    'CHURNED',
    'ENGAGEMENT_IMPROVED',
    'NO_RESPONSE'
];

export default function Modal({
    type,
    initialData,
    close,
    submit
}) {
    const isExperiment =
        type === 'experiment' || type === 'editExperiment';

    const isEditingExperiment = type === 'editExperiment';

    const isIntervention =
        type === 'intervention' || type === 'editIntervention';

    const isEditingIntervention = type === 'editIntervention';

    const isOutcome =
        type === 'outcome' || type === 'editOutcome';

    const isEditingOutcome = type === 'editOutcome';

    const isEditing =
        isEditingExperiment ||
        isEditingIntervention ||
        isEditingOutcome;

    const titles = {
        experiment: 'Create experiment',
        editExperiment: 'Edit experiment',
        intervention: 'Create intervention',
        editIntervention: 'Edit intervention',
        outcome: 'Record outcome',
        editOutcome: 'Edit outcome'
    };

    const [form, setForm] = useState({
        name: '',
        objective: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'DRAFT'
    });

    const [formError, setFormError] = useState('');
    const [availableExperiments, setAvailableExperiments] = useState([]);
    const [loadingExperiments, setLoadingExperiments] = useState(false);

    // Load experiments for the intervention dropdown.
    useEffect(() => {
        if (!isIntervention) {
            setAvailableExperiments([]);
            return;
        }

        let isMounted = true;

        const loadExperiments = async () => {
            try {
                setLoadingExperiments(true);
                setFormError('');

                const data = await getExperiments();

                if (isMounted) {
                    setAvailableExperiments(
                        Array.isArray(data) ? data : []
                    );
                }
            } catch (error) {
                if (isMounted) {
                    setFormError(
                        error.message || 'Unable to load experiments.'
                    );
                }
            } finally {
                if (isMounted) {
                    setLoadingExperiments(false);
                }
            }
        };

        loadExperiments();

        return () => {
            isMounted = false;
        };
    }, [isIntervention]);

    // Initialize the form whenever the modal type or selected record changes.
    useEffect(() => {
        if (isEditingExperiment && initialData) {
            setForm({
                name: initialData.experimentName || '',
                objective: initialData.objective || '',
                description: initialData.description || '',
                startDate: initialData.startDate || '',
                endDate: initialData.endDate || '',
                status: initialData.status || 'DRAFT'
            });
        } else if (isEditingIntervention && initialData) {
            setForm({
                experimentId: initialData.experimentId || '',
                interventionName: initialData.interventionName || '',
                interventionType: initialData.interventionType || '',
                description: initialData.description || ''
            });
        } else if (isOutcome) {
            setForm({
                assignmentId: initialData?.assignmentId || '',
                status: initialData?.outcomeStatus || ''
            });
        } else {
            setForm({
                name: '',
                objective: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'DRAFT'
            });
        }

        setFormError('');
    }, [
        type,
        initialData,
        isEditingExperiment,
        isEditingIntervention,
        isOutcome
    ]);

    const handleChange = event => {
        const { name, value } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        setFormError('');

        if (isExperiment) {
            if (!form.name.trim()) {
                setFormError('Experiment name is required.');
                return;
            }

            if (
                form.startDate &&
                form.endDate &&
                form.endDate < form.startDate
            ) {
                setFormError('End date cannot be before start date.');
                return;
            }

            if (!form.status) {
                setFormError('Please select an experiment status.');
                return;
            }
        }

        if (isIntervention) {
            if (!form.experimentId) {
                setFormError('Please select an experiment.');
                return;
            }

            if (!form.interventionName?.trim()) {
                setFormError('Intervention name is required.');
                return;
            }

            if (!form.interventionType) {
                setFormError('Please select an intervention type.');
                return;
            }
        }

        if (isOutcome) {
            if (
                !form.assignmentId ||
                Number(form.assignmentId) <= 0
            ) {
                setFormError('Enter a valid Assignment ID.');
                return;
            }

            if (!form.status || form.status === 'PENDING') {
                setFormError('Please select a valid outcome status.');
                return;
            }
        }

        submit(form);
    };

    const renderExperimentFields = () => (
        <>
            <label>
                Experiment name
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Objective
                <input
                    type="text"
                    name="objective"
                    value={form.objective}
                    onChange={handleChange}
                />
            </label>

            <label className="full">
                Description
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                />
            </label>

            <label>
                Start date
                <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                />
            </label>

            <label>
                End date
                <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                />
            </label>

            <label>
                Status
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                >
                    {experimentStatuses.map(status => (
                        <option key={status} value={status}>
                            {status.replaceAll('_', ' ')}
                        </option>
                    ))}
                </select>
            </label>
        </>
    );

    const renderInterventionFields = () => (
        <>
            <label className="full">
                Experiment
                <select
                    name="experimentId"
                    value={form.experimentId || ''}
                    onChange={handleChange}
                    required
                    disabled={loadingExperiments}
                >
                    <option value="">
                        {loadingExperiments
                            ? 'Loading experiments...'
                            : 'Select experiment'}
                    </option>

                    {availableExperiments.map(experiment => (
                        <option
                            key={experiment.experimentId}
                            value={experiment.experimentId}
                        >
                            {experiment.experimentName}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Intervention name
                <input
                    type="text"
                    name="interventionName"
                    value={form.interventionName || ''}
                    onChange={handleChange}
                    maxLength={150}
                    required
                />
            </label>

            <label>
                Intervention type
                <select
                    name="interventionType"
                    value={form.interventionType || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select type</option>

                    {interventionTypes.map(interventionType => (
                        <option
                            key={interventionType}
                            value={interventionType}
                        >
                            {interventionType.replaceAll('_', ' ')}
                        </option>
                    ))}
                </select>
            </label>

            <label className="full">
                Description
                <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    rows={3}
                />
            </label>
        </>
    );

    const renderOutcomeFields = () => (
        <>
            <label>
                Assignment ID
                <input
                    type="number"
                    name="assignmentId"
                    min="1"
                    value={form.assignmentId || ''}
                    onChange={handleChange}
                    required
                    readOnly={isEditingOutcome}
                />
            </label>

            <label>
                Outcome status
                <select
                    name="status"
                    value={form.status || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select status</option>

                    {outcomeStatuses.map(status => (
                        <option key={status} value={status}>
                            {status.replaceAll('_', ' ')}
                        </option>
                    ))}
                </select>
            </label>
        </>
    );

    const renderOtherFields = () => {
        if (isIntervention) {
            return renderInterventionFields();
        }

        if (isOutcome) {
            return renderOutcomeFields();
        }

        return null;
    };

    return (
        <div
            className="modal-backdrop"
            onMouseDown={event => {
                if (event.target === event.currentTarget) {
                    close();
                }
            }}
        >
            <div className="modal">
                <button
                    type="button"
                    className="modal-close"
                    onClick={close}
                    aria-label="Close modal"
                >
                    <Icon name="close" />
                </button>

                <h2>{titles[type]}</h2>

                <p className="modal-sub">
                    {isEditing
                        ? `Update the ${
                            isEditingExperiment
                                ? 'experiment'
                                : isEditingIntervention
                                    ? 'intervention'
                                    : 'outcome'
                        } details below.`
                        : 'Enter the details below.'}
                </p>

                <form
                    className="modal-form"
                    onSubmit={handleSubmit}
                >
                    {isExperiment
                        ? renderExperimentFields()
                        : renderOtherFields()}

                    {formError && (
                        <p className="form-error full">
                            {formError}
                        </p>
                    )}

                    <div className="modal-actions full">
                        <Button
                            variant="secondary"
                            onClick={close}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            {isEditing ? 'Save changes' : titles[type]}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
