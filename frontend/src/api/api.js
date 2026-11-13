const API_BASE_URL = '/api';

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const errorText = await response.text();

        let message = errorText || `Request failed: ${response.status}`;

        try {
            const errorData = JSON.parse(errorText);

            message =
                errorData.detail ||
                errorData.message ||
                errorData.error ||
                message;
        } catch {
            // Keep original response text.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return null;
}


// =====================================
// AUTHENTICATION APIs
// =====================================

export function login(email, password) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export function logout() {
    return apiRequest('/auth/logout', {
        method: 'POST'
    });
}

export function getCurrentUser() {
    return apiRequest('/auth/me');
}


// =====================================
// DASHBOARD APIs
// =====================================

export function getDashboardSummary() {
    return apiRequest('/dashboard/summary');
}


// =====================================
// EXPERIMENT APIs
// =====================================

export function getExperiments() {
    return apiRequest('/experiments');
}

export function getExperimentById(id) {
    return apiRequest(`/experiments/${id}`);
}

export function createExperiment(experimentData) {
    return apiRequest('/experiments', {
        method: 'POST',
        body: JSON.stringify(experimentData)
    });
}

export function updateExperiment(id, experimentData) {
    return apiRequest(`/experiments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(experimentData)
    });
}

export function deleteExperiment(id) {
    return apiRequest(`/experiments/${id}`, {
        method: 'DELETE'
    });
}


// =====================================
// INTERVENTION APIs
// =====================================

export function getInterventions() {
    return apiRequest('/interventions');
}

export function getInterventionById(id) {
    return apiRequest(`/interventions/${id}`);
}

export function getInterventionsByExperiment(experimentId) {
    return apiRequest(`/interventions/experiment/${experimentId}`);
}

export function createIntervention(interventionData) {
    return apiRequest('/interventions', {
        method: 'POST',
        body: JSON.stringify(interventionData)
    });
}

export function updateIntervention(id, interventionData) {
    return apiRequest(`/interventions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(interventionData)
    });
}

export function deleteIntervention(id) {
    return apiRequest(`/interventions/${id}`, {
        method: 'DELETE'
    });
}


// =====================================
// ASSIGNMENT APIs
// =====================================

export function getAssignments() {
    return apiRequest('/assignments');
}

export function getAssignmentById(id) {
    return apiRequest(`/assignments/${id}`);
}

export function getAssignmentsByExperiment(experimentId) {
    return apiRequest(`/assignments/experiment/${experimentId}`);
}

export function createAssignment(assignmentData) {
    return apiRequest('/assignments', {
        method: 'POST',
        body: JSON.stringify(assignmentData)
    });
}

export function autoAssignCustomers(experimentId) {
    return apiRequest(`/assignments/experiment/${experimentId}/auto-assign`, {
        method: 'POST'
    });
}


// =====================================
// OUTCOME APIs
// =====================================

export function getOutcomes() {
    return apiRequest('/outcomes');
}

export function getOutcomeById(id) {
    return apiRequest(`/outcomes/${id}`);
}

export function getOutcomeByAssignment(assignmentId) {
    return apiRequest(`/outcomes/assignment/${assignmentId}`);
}

export function getOutcomesByExperiment(experimentId) {
    return apiRequest(`/outcomes/experiment/${experimentId}`);
}

export function createOutcome(outcomeData) {
    return apiRequest('/outcomes', {
        method: 'POST',
        body: JSON.stringify(outcomeData)
    });
}

export function updateOutcome(id, outcomeData) {
    return apiRequest(`/outcomes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(outcomeData)
    });
}

export function deleteOutcome(id) {
    return apiRequest(`/outcomes/${id}`, {
        method: 'DELETE'
    });
}


// =====================================
// EXPERIMENT ANALYSIS APIs
// =====================================

export function getExperimentAnalysis(experimentId) {
    return apiRequest(`/experiments/${experimentId}/analysis`);
}
