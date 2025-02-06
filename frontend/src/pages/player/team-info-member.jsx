import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTeamDetails } from '../../api/teamAPI';

const TeamInfoM = () => {
	const { teamId } = useParams();
	const [teamInfo, setTeamInfo] = useState();
	const [players, setPlayers] = useState([]);

	// useEffect for data fetching
	useEffect(() => {
		// Fetch teams
		const fetchTeamData = async () => {
			try {
				const response = await getTeamDetails(teamId);
				setTeamInfo(response.data.team);
				setPlayers(response.data.players);
			} catch (error) {
				console.error('Error fetching teams: ', error);
			}
		};
		fetchTeamData();
	}, [teamId]);

	return (
		<div className='container'>
			<div>
				{teamInfo && (
					<div>
						<h2 className='mb-4'>Team Info</h2>
						<div className='card'>
							<div className='card-body'>
								<p className='card-text'>
									<strong>Name:</strong> {teamInfo.teamName}
								</p>
								<p className='card-text'>
									<strong>Game:</strong> {teamInfo.gameName}
								</p>
								<p className='card-text'>
									<strong>Size:</strong> {teamInfo.teamSize} Players
								</p>
								<p className='card-text'>
									<strong>Gender Group:</strong> {teamInfo.createdBy}
								</p>
								<p className='card-text'>
									<strong>Age Limit:</strong> {teamInfo.minAge} - {teamInfo.maxAge} yrs
								</p>
								<p className='card-text'>
									<strong>Available Slots:</strong> {teamInfo.teamSize - teamInfo.playerIds.length}
								</p>
							</div>
						</div>
					</div>
				)}

				{players.length > 0 && (
					<div>
						<h2 className='mt-5 mb-4 '>Players Info</h2>
						<table className='table table-stripedtable table-striped table-hover table-bordered mb-5'>
							<thead className='text-center table-dark'>
								<tr>
									<th>Name</th>
									<th>Age</th>
									<th>Contact Details</th>
								</tr>
							</thead>
							<tbody>
								{players.map((player) => (
									<tr key={player._id}>
										<td className='ps-5'>{player.firstName + ' ' + player.lastName}</td>
										<td className='text-center'>
											{new Date().getFullYear() - new Date(player.birthDay).getFullYear()}
										</td>
										<td className='ps-5'>{player.email}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Add loading indicator if data is not yet fetched */}
				{!teamInfo && <p>Loading team info...</p>}
				{players.length === 0 && <h5 className='m-5'>No players in this team</h5>}
			</div>
		</div>
	);
};

export default TeamInfoM;
