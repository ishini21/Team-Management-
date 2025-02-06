import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getTeams, joinATeam, getJoinedTeams } from '../../api/teamAPI';
import { UseData } from '../../hooks/useData';

const Teams = () => {
	const navigate = useNavigate();
	const [teams, setTeams] = useState([]);
	const [joinedTeams, setJoinedTeams] = useState([]);

	// Get user data
	const { gender, birthDay } = UseData();

	// Calculate age
	const birthYear = new Date(birthDay).getFullYear();
	const currentYear = new Date().getFullYear();
	const age = currentYear - birthYear;

	// Function to get joined team names and IDs
	const getJoinedTeamInfo = () => {
		const joinedTeamNames = joinedTeams.map((team) => team.teamName);
		const joinedTeamIds = joinedTeams.map((team) => team._id);
		return { joinedTeamNames, joinedTeamIds };
	};

	// useEffect for data fetching
	useEffect(() => {
		fetchAllTeams();
		fetchJoinedTeams();
	}, []);

	// Fetch all teams
	const fetchAllTeams = async () => {
		try {
			const response = await getTeams();
			setTeams(response.data);
		} catch (error) {
			console.error('Error fetching teams: ', error);
		}
	};

	// Fetch joined teams
	const fetchJoinedTeams = async () => {
		try {
			const response = await getJoinedTeams();
			setJoinedTeams(response.data);
		} catch (error) {
			console.error('Error fetching joined teams: ', error);
		}
	};

	// Handle Joining a team

	// Join button handler
	const handleJoin = async (teamId, gameName) => {
		try {
			const response = await joinATeam(teamId, gameName);
			if (response.status === 200) {
				// Show success alert
				Swal.fire({
					icon: 'success',
					title: 'Success!',
					text: response.data.message
				});
				fetchAllTeams();
				fetchJoinedTeams();
			}
		} catch (error) {
			// Show error alert
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: error.data.message
			});
		}
	};

	// Get joined team names and IDs
	const { joinedTeamNames, joinedTeamIds } = getJoinedTeamInfo();

	return (
		<div className='container'>
			{/* Teams Table */}
			<div>
				<div className='d-flex my-4'>
					<h2>Team List</h2>
				</div>
				<table className='table table-striped table-hover table-bordered mb-5'>
					<thead className='text-center table-dark'>
						<tr>
							<th>Team Name</th>
							<th>Game Name</th>
							<th className='col-2'>Gender Group</th>
							<th className='col-1'>Age Limit</th>
							<th>Players</th>
							<th className='col-2'>Actions</th>
						</tr>
					</thead>
					<tbody className='align-middle'>
						{teams.map((team) => (
							<tr key={team._id}>
								<td className='ps-4'>{team.teamName}</td>
								<td className='text-center'>{team.gameName === 'cricket' ? 'Cricket' : 'VolleyBall'}</td>
								<td className='text-center'>{team.genderGroup === 'male' ? 'Male' : 'Female'}</td>
								<td className='text-center'>
									{team.minAge} - {team.maxAge}
								</td>
								<td className='text-center'>
									{team.playerIds.length} / {team.teamSize}
								</td>
								<td className='d-flex align-items-center '>
									{/* Team Info */}
									<button
										type='button'
										className='btn btn-sm btn-secondary me-2'
										onClick={() => navigate(`/team/${team._id}`)}
									>
										View
									</button>
									{/* Join Status button */}
									<button
										type='button'
										onClick={handleJoin.bind(this, team._id, team.gameName)}
										className={`btn btn-sm btn-primary ${
											joinedTeamIds.includes(team._id) ||
											team.genderGroup !== gender ||
											team.minAge > age + 1 ||
											team.maxAge < age ||
											team.playerIds.length >= team.teamSize
												? 'disabled bg-primary'
												: ''
										}`}
									>
										{joinedTeamNames.includes(team.teamName) ? 'Joined' : 'Join'}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className='text-danger'>
					<p>Please consider these conditions:</p>
					<div className='ps-5'>
						<p>You can join only one team in each game.</p>
						<p>Consider the gender group and age limit.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Teams;
