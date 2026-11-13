
import { useEffect, useState } from 'react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Modal from './components/Modal';
import LoginPage from './LoginPage';

import { Icon, Button } from './components/Shared';

import OverviewView from './views/OverviewView';
import ExperimentInterventionView from './views/ExperimentInterventionView';
import AssignmentsView from './views/AssignmentsView';
import OutcomesView from './views/OutcomesView';

import {
    login,
    logout,
    getCurrentUser,
    createExperiment,
    updateExperiment,
    deleteExperiment,
    createIntervention,
    updateIntervention,
    deleteIntervention
} from './api/api';

const pageMeta = {
    overview: {
        title: 'Overview',
        desc: 'Monitor customer retention and experiment performance'
    },

    management: {
        title: 'Experiment & Intervention Management',
        desc: 'Create and manage retention experiments and interventions'
    },

    assignments: {
        title: 'Customer Assignments',
        desc: 'Automatically allocate eligible customers into control and treatment groups'
    },

    outcomes: {
        title: 'Outcome Tracking',
        desc: 'Record and review customer experiment outcomes'
    }
};

export default function App() {
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);

    const [page, setPage] = useState('overview');

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [modal, setModal] = useState(null);

    const [editingExperiment, setEditingExperiment] = useState(null);
    const [editingIntervention, setEditingIntervention] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [interventionDeleteTarget, setInterventionDeleteTarget] =
        useState(null);

    const [toast, setToast] = useState('');

    const [experimentsRefreshKey, setExperimentsRefreshKey] = useState(0);
    const [interventionsRefreshKey, setInterventionsRefreshKey] =
        useState(0);

    const meta = pageMeta[page];

    // Check whether an admin session already exists.
    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            try {
                const currentUser = await getCurrentUser();

                if (active) {
                    setUser(currentUser);
                }
            } catch (error) {
                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setCheckingSession(false);
                }
            }
        };

        checkSession();

        return () => {
            active = false;
        };
    }, []);

    // Login using backend authentication.
    const handleLogin = async (email, password) => {
        const loggedInUser = await login(email, password);

        setUser(loggedInUser);
        setPage('overview');
    };

    // Logout and invalidate backend session.
    const handleLogout = async () => {
        try {
            await logout();

            setUser(null);
            setPage('overview');
            setModal(null);
            setDeleteTarget(null);
            setInterventionDeleteTarget(null);
            setMobileOpen(false);

        } catch (error) {
            showToast(error.message || 'Unable to logout. Please try again.');
        }
    };

    // Display success/error messages.
    const showToast = message => {
        setToast(message);

        window.setTimeout(() => {
            setToast('');
        }, 3500);
    };

    // Navigation.
    const navigate = nextPage => {
        setPage(nextPage);
    };

    // Close modal and clear editing records.
    const closeModal = () => {
        setModal(null);
        setEditingExperiment(null);
        setEditingIntervention(null);
    };

    // Open experiment edit modal.
    const openEditExperiment = experiment => {
        setEditingExperiment(experiment);
        setEditingIntervention(null);
        setModal('editExperiment');
    };

    // Open intervention edit modal.
    const openEditIntervention = intervention => {
        setEditingIntervention(intervention);
        setEditingExperiment(null);
        setModal('editIntervention');
    };

    // Delete experiment.
    const handleDeleteExperiment = experiment => {
        setDeleteTarget(experiment);
    };

    const confirmDeleteExperiment = async () => {
        if (!deleteTarget) return;

        try {
            await deleteExperiment(deleteTarget.experimentId);

            setDeleteTarget(null);
            setExperimentsRefreshKey(current => current + 1);

            showToast('Experiment deleted successfully.');
        } catch (error) {
            showToast(
                error.message || 'Failed to delete experiment.'
            );
        }
    };

    // Delete intervention.
    const handleDeleteIntervention = intervention => {
        setInterventionDeleteTarget(intervention);
    };

    const confirmDeleteIntervention = async () => {
        if (!interventionDeleteTarget) return;

        try {
            await deleteIntervention(
                interventionDeleteTarget.interventionId
            );

            setInterventionDeleteTarget(null);
            setInterventionsRefreshKey(current => current + 1);

            showToast('Intervention deleted successfully.');
        } catch (error) {
            showToast(
                error.message || 'Failed to delete intervention.'
            );
        }
    };

    // Handle topbar primary actions.
    const handlePrimaryAction = () => {
        if (page === 'outcomes') {
            setModal('outcome');
        }
    };

    // Handle experiment and intervention form submissions.
    const submitModal = async formData => {
        try {
            // CREATE / UPDATE EXPERIMENT
            if (
                modal === 'experiment' ||
                modal === 'editExperiment'
            ) {
                const experimentData = {
                    experimentName: formData.name.trim(),
                    objective: formData.objective?.trim() || null,
                    description: formData.description?.trim() || null,
                    startDate: formData.startDate || null,
                    endDate: formData.endDate || null,
                    status: formData.status
                };

                if (modal === 'editExperiment') {
                    await updateExperiment(
                        editingExperiment.experimentId,
                        experimentData
                    );

                    showToast('Experiment updated successfully.');
                } else {
                    await createExperiment(experimentData);

                    showToast('Experiment created successfully.');
                }

                closeModal();

                setExperimentsRefreshKey(current => current + 1);

                return;
            }

            // CREATE / UPDATE INTERVENTION
            if (
                modal === 'intervention' ||
                modal === 'editIntervention'
            ) {
                const interventionData = {
                    experimentId: Number(formData.experimentId),
                    interventionName: formData.interventionName.trim(),
                    interventionType: formData.interventionType,
                    description: formData.description?.trim() || null
                };

                if (modal === 'editIntervention') {
                    await updateIntervention(
                        editingIntervention.interventionId,
                        interventionData
                    );

                    showToast('Intervention updated successfully.');
                } else {
                    await createIntervention(interventionData);

                    showToast('Intervention created successfully.');
                }

                closeModal();

                setInterventionsRefreshKey(current => current + 1);

                return;
            }

            // Outcome submission is not connected here yet.
            showToast('This form is not connected to backend API yet.');

        } catch (error) {
            showToast(
                error.message || 'Unable to save. Please try again.'
            );
        }
    };

    // Wait until the existing session check finishes.
    if (checkingSession) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <p>Checking your session...</p>
                </div>
            </div>
        );
    }

    // Show login page when no valid session exists.
    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="app-shell">

            <Sidebar
                page={page}
                setPage={navigate}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                closeMobile={() => setMobileOpen(false)}
                onLogout={handleLogout}
                user={user}
            />

            <main
                className={`main ${collapsed ? 'sidebar-collapsed' : ''}`}
            >
                <Topbar
                    meta={meta}
                    setMobileOpen={setMobileOpen}
                    onPrimaryAction={handlePrimaryAction}
                />

                <div className="content">

                    {page === 'overview' && (
                        <OverviewView navigate={navigate} />
                    )}

                    {page === 'management' && (
                        <ExperimentInterventionView
                            onCreateExperiment={() => {
                                setEditingExperiment(null);
                                setEditingIntervention(null);
                                setModal('experiment');
                            }}
                            onCreateIntervention={() => {
                                setEditingExperiment(null);
                                setEditingIntervention(null);
                                setModal('intervention');
                            }}
                            refreshKey={experimentsRefreshKey}
                            interventionsRefreshKey={interventionsRefreshKey}
                            onEditExperiment={openEditExperiment}
                            onDeleteExperiment={handleDeleteExperiment}
                            onEditIntervention={openEditIntervention}
                            onDeleteIntervention={handleDeleteIntervention}
                        />
                    )}

                    {page === 'assignments' && (
                        <AssignmentsView />
                    )}

                    {page === 'outcomes' && (
                        <OutcomesView />
                    )}

                </div>
            </main>

            {/* Create / Edit Modal */}
            {modal && (
                <Modal
                    key={`${modal}-${editingExperiment?.experimentId || editingIntervention?.interventionId || 'new'}`}
                    type={modal}
                    initialData={editingExperiment || editingIntervention}
                    close={closeModal}
                    submit={submitModal}
                />
            )}

            {/* Experiment Delete Confirmation */}
            {deleteTarget && (
                <div className="modal-backdrop">
                    <div className="confirm-dialog">

                        <div className="confirm-icon">
                            <Icon name="trash" size={22} />
                        </div>

                        <h2>Delete experiment?</h2>

                        <p>
                            Are you sure you want to delete
                            <strong>
                                {' '}{deleteTarget.experimentName}
                            </strong>?
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <Button
                                variant="secondary"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="danger"
                                onClick={confirmDeleteExperiment}
                            >
                                Delete
                            </Button>
                        </div>

                    </div>
                </div>
            )}

            {/* Intervention Delete Confirmation */}
            {interventionDeleteTarget && (
                <div className="modal-backdrop">
                    <div className="confirm-dialog">

                        <div className="confirm-icon">
                            <Icon name="trash" size={22} />
                        </div>

                        <h2>Delete intervention?</h2>

                        <p>
                            Are you sure you want to delete
                            <strong>
                                {' '}{interventionDeleteTarget.interventionName}
                            </strong>?
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setInterventionDeleteTarget(null)
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="danger"
                                onClick={confirmDeleteIntervention}
                            >
                                Delete
                            </Button>
                        </div>

                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="toast">
                    <span>
                        <Icon name="check" size={15} />
                    </span>

                    {toast}

                    <button onClick={() => setToast('')}>
                        <Icon name="close" size={14} />
                    </button>
                </div>
            )}

        </div>
    );
}
