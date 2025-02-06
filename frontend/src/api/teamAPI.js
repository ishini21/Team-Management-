import axios from 'axios';
import requestAuth from './requestAuth';
import ENV from '../configs';

// Set the base URL for the axios requests
axios.defaults.baseURL = ENV.API_URL;


// User login
export const addTeam = async (values) => {
	try {
		const response = await axios.post('/add-team', values, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get all teams
export const getAllTeams = async () => {
	try {
		const response = await axios.get('/get-all-teams', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get all teams
export const getTeams = async () => {
	try {
		const response = await axios.get('/get-teams', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get joined teams
export const getJoinedTeams = async () => {
	try {
		const response = await axios.get('/joined-teams', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get team details (User)
export const getTeamDetails = async (teamId) => {
	try {
		const response = await axios.get(`/team/${teamId}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get team details (Admin)
export const getTeamDetailsAdmin = async (teamId) => {
	try {
		const response = await axios.get(`/team-info/${teamId}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get totals
export const getTotals = async () => {
	try {
		const response = await axios.get('/totals', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Update a team
export const updateATeam = async (teamId, values) => {
	try {
		const response = await axios.put(`/update-team/${teamId}`, values, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Join a team
export const joinATeam = async (teamId, gameName) => {
	try {
		const response = await axios.put(`/join/${teamId}/${gameName}`, {}, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Delete a team
export const deleteATeam = async (teamId) => {
	try {
		const response = await axios.delete(`/delete/${teamId}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Delete a member from a team
export const removeFromTeam = async (teamId, playerId) => {
	try {
		const response = await axios.put(`/remove/${teamId}/${playerId}`, {}, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};
