import { ZodError } from 'zod';
import TeamSchema from '../models/team.model.js';
import UserSchema from '../models/user.model.js';
import { addTeamSchema, updateTeamSchema } from '../validations/team.validation.js';

// Add Controllers
// Add a new Team
export const addTeam = async (req, res) => {
	try {
		// Parse JSON request body
		const teamData = req.body;

		teamData.teamSize = parseInt(teamData.teamSize);
		teamData.additionalMembers = parseInt(teamData.additionalMembers);
		teamData.minAge = parseInt(teamData.minAge);
		teamData.maxAge = parseInt(teamData.maxAge);

		// Parse and validate data using Zod schema
		const validatedData = addTeamSchema.safeParse(teamData);

		// Check if validation succeeded
		if (validatedData.success) {
			// Destructure validated data
			const { teamName, gameName, teamSize, additionalMembers, genderGroup, minAge, maxAge } = validatedData.data;

			// Check if the team already exists
			const teamExists = await TeamSchema.findOne({ teamName: teamName });
			if (teamExists) {
				return res.status(400).send({ message: 'Team already exists' });
			}

			// Create a new Team object
			const newTeam = new TeamSchema({
				teamName,
				gameName,
				teamSize,
				additionalMembers,
				genderGroup,
				minAge,
				maxAge
			});

			// Save the new team to the database
			await newTeam.save();

			// Send a success response
			res.status(201).send({ message: 'Team added successfully' });
		} else {
			// Send a 400 response with validation errors
			res.status(400).send(validatedData.error);
		}
	} catch (error) {
		if (error instanceof ZodError) {
			// Send a 400 response if the request body is invalid
			res.status(400).send(error.errors);
		} else {
			// Send a 500 response for other types of errors
			res.status(500).send({ message: 'Failed to add team. Please try again later.' });
		}
	}
};

// Get Controllers
// Get all Teams
export const getAllTeams = async (req, res) => {
	// Filter data
	const filter = {};

	// Get all teams from the database
	const teams = await TeamSchema.find(filter);

	// Send a success response
	res.status(200).send(teams);

	try {
	} catch (error) {
		// Send a 500 response for other types of errors
		res.status(500).send({ message: 'Failed to get teams. Please try again later.' });
	}
};

// Get a single Team by ID
export const getTeamById = async (req, res) => {
	try {
	} catch (error) {}
};

// Get Joined Teams by Player ID
export const getJoinedTeams = async (req, res) => {
	try {
		// Get player ID from request parameters
		const playerId = req.user.userId;

		// Check if the player exists
		const player = await UserSchema.findOne({ _id: playerId });
		if (!player) {
			return res.status(404).send({ message: 'Player not found' });
		}

		// Filter player joined teams
		const filter = { playerIds: playerId };

		// Get all teams from the database
		const teams = await TeamSchema.find(filter);

		// Send a success response
		res.status(200).send(teams);
	} catch (error) {}
};

// Get Team details by team id
export const getTeamDetails = async (req, res) => {
	try {
		// Get team ID from request parameters
		const teamId = req.params.id;

		// Check if the team exists
		const team = await TeamSchema.findById(teamId);

		// Team not found
		if (!team) {
			return res.status(404).send({ message: 'Team not found' });
		}

		// Get team members
		const players = await UserSchema.find({ _id: { $in: team.playerIds } });

		// Send a success response
		res.status(200).send({ team, players });
	} catch (error) {
		res.status(500).send({ message: 'Failed to get team details. Please try again later.' });
	}
};

// Get Totals (Total Teams, Total cricket teams, total vollyball teams, total joined users, total not joined users, Empty teams, etc)
export const getTotals = async (req, res) => {
	try {
		// Get all teams from the database
		const teams = await TeamSchema.find();

		// Total Teams Count
		const totalTeamsCount = teams.length;

		// Game-wise Teams Count
		const gameWiseTeamsCount = {};
		teams.forEach((team) => {
			if (gameWiseTeamsCount[team.gameName]) {
				gameWiseTeamsCount[team.gameName]++;
			} else {
				gameWiseTeamsCount[team.gameName] = 1;
			}
		});

		// Total joined players (total of team.playerIds.length)
		const playerCount = teams.reduce((acc, team) => acc + team.playerIds.length, 0);

		// Send a success response
		res.status(200).send({ totalTeamsCount, gameWiseTeamsCount, playerCount });
	} catch (error) {
		res.status(500).send({ message: 'Failed to get totals. Please try again later.' });
	}
};

// Update Controllers
// Update a Team by ID
export const updateATeam = async (req, res) => {
	try {
		// Get team ID from request parameters
		const teamId = req.params.id;

		// Check if the team exists
		const team = await TeamSchema.findOne({ _id: teamId });
		if (!team) {
			return res.status(404).send({ message: 'Team not found' });
		}

		// Parse JSON request body
		const teamData = req.body;

		teamData.teamSize = parseInt(teamData.teamSize);
		teamData.additionalMembers = parseInt(teamData.additionalMembers);
		teamData.minAge = parseInt(teamData.minAge);
		teamData.maxAge = parseInt(teamData.maxAge);

		// Parse and validate data using Zod schema
		const validatedData = updateTeamSchema.safeParse(teamData);

		// Check if validation succeeded
		if (validatedData.success) {
			// Destructure validated data
			const { teamName, gameName, teamSize, additionalMembers, genderGroup, minAge, maxAge } = validatedData.data;

			// Find the team by ID and update the team
			const updatedTeam = await TeamSchema.findByIdAndUpdate(
				teamId,
				{ teamName, gameName, teamSize, additionalMembers, genderGroup, minAge, maxAge },
				{ new: true }
			);

			// Send a success response
			res.status(200).send({ message: 'Team updated successfully', team: updatedTeam });
		}
	} catch (error) {
		console.error(error);
		if (error instanceof ZodError) {
			// Send a 400 response if the request body is invalid
			res.status(400).send(error.errors);
		} else {
			// Send a 500 response for other types of errors
			res.status(500).send({ message: 'Failed to update team. Please try again later.' });
		}
	}
};

// Update playerIds of a Team
export const joinATeam = async (req, res) => {
	try {
		// Get game name from request body
		const gameName = req.params.gameName;

		// Get team ID from request parameters
		const teamId = req.params.id;

		// Check if the team exists
		const team = await TeamSchema.findOne({ _id: teamId });
		if (!team) {
			return res.status(404).send({ message: 'Team not found' });
		}

		// Get player IDs from request body
		const playerId = req.user.userId;

		// Check if the player exists
		const player = await UserSchema.findOne({ _id: playerId });
		if (!player) {
			return res.status(404).send({ message: 'Player not found' });
		}

		// Check if the team is full
		if (team.playerIds.length >= team.teamSize) {
			return res.status(400).send({ message: 'Team is full' });
		}

		// Check if the player is already in another team
		// Filter cricket teams
		const filter = { gameName: gameName };

		// Get all teams from the database
		const teams = await TeamSchema.find(filter);
		for (let i = 0; i < teams.length; i++) {
			if (teams[i].playerIds.includes(playerId)) {
				return res.status(400).send({ message: `Player is already in another ${gameName} team` });
			}
		}

		// Check gender group
		if (player.gender !== team.genderGroup) {
			return res.status(400).send({ message: `Player cannot join the ${team.genderGroup} teams` });
		}

		// Check if the player is eligible to join the team
		const age = new Date().getFullYear() - player.birthDay.getFullYear();
		if (age < team.minAge || age > team.maxAge) {
			return res.status(400).send({ message: 'Player is not eligible to join the team' });
		}

		// Find the team by ID and update playerIds
		const updatedTeam = await TeamSchema.findByIdAndUpdate(teamId, { $push: { playerIds: playerId } }, { new: true });

		// Send a success response
		res.status(200).send({ message: 'Player added to the team successfully', team: updatedTeam });
	} catch (error) {
		res.status(500).send({ message: 'Failed to update team. Please try again later.' });
	}
};

// Leave from a Team
export const removeFromTeam = async (req, res) => {
	try {
		// Get team ID from request parameters
		const teamId = req.params.id;

		// Check if the team exists
		const team = await TeamSchema.findOne({ _id: teamId });
		if (!team) {
			return res.status(404).send({ message: 'Team not found' });
		}

		// Get player ID from request body
		const playerId = req.params.playerId;
		if (!playerId) {
			return res.status(400).send({ message: 'Player ID is required' });
		}

		// Check if the player is in the team
		if (!team.playerIds.includes(playerId)) {
			return res.status(400).send({ message: 'Player is not in the team' });
		}

		// Find the team by ID and update playerIds
		const updatedTeam = await TeamSchema.findByIdAndUpdate(teamId, { $pull: { playerIds: playerId } }, { new: true });

		// Send a success response
		res.status(200).send({ message: 'Player removed from the team successfully', team: updatedTeam });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Failed to update team. Please try again later.' });
	}
};

// Delete Controllers
// Delete a Team by ID
export const deleteATeam = async (req, res) => {
	try {
		// Get team ID from request parameters
		const teamId = req.params.id;

		// Check if the team exists
		const team = await TeamSchema.findOne({ _id: teamId });
		if (!team) {
			return res.status(404).send({ message: 'Team not found' });
		}

		// Delete the team from the database
		await TeamSchema.findByIdAndDelete(teamId);

		// Send a success response
		res.status(200).send({ message: 'Team deleted successfully' });
	} catch (error) {}
};
