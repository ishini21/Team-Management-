import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getTeamDetailsAdmin, removeFromTeam } from '../../api/teamAPI';

const TeamInfoM = () => {
	const { teamId } = useParams();
	const [teamInfo, setTeamInfo] = useState();
	const [players, setPlayers] = useState([]);

	// useEffect for data fetching
	useEffect(() => {
		// Fetch teams
		const fetchTeamData = async () => {
			try {
				const response = await getTeamDetailsAdmin(teamId);
				setTeamInfo(response.data.team);
				setPlayers(response.data.players);
			} catch (error) {
				console.error('Error fetching teams: ', error);
			}
		};
		fetchTeamData();
	}, [teamId]);

	// Function to handle member deletion
	const handleDeleteMember = async (playerId) => {
		// Show a confirmation dialog before deleting the member
		Swal.fire({
			title: 'Are you sure?',
			text: 'You are about to remove this player from the team.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, remove it!',
			cancelButtonText: 'Cancel'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await removeFromTeam(teamId, playerId);
					if (response.status === 200) {
						// Show success alert
						Swal.fire({
							icon: 'success',
							title: 'Success!',
							text: response.data.message,
							showConfirmButton: true,
							timer: 1500,
							timerProgressBar: true,
							willClose: () => {
								// Reload the page after successful deletion
								window.location.reload();
							}
						});
					}
				} catch (error) {
					console.error('Error deleting member: ', error);
					// Show error alert
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Failed to delete member. Please try again later.'
					});
				}
			}
		});
	};

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
									<strong>Game:</strong> {teamInfo.gameName === 'cricket' ? 'Cricket' : 'Volleyball'}
								</p>
								<p className='card-text'>
									<strong>Gender Group:</strong> {teamInfo.genderGroup === 'female' ? 'Female' : 'Male'}
								</p>
								<p className='card-text'>
									<strong>Team Size:</strong> {teamInfo.teamSize} Players
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
						<h2 className='mt-5 mb-4'>Players Info</h2>
						<table className='table table-striped table-hover table-bordered mb-5'>
							<thead className='text-center table-dark'>
								<tr>
									<th>Name</th>
									<th>Age</th>
									<th>Contact Details</th>
									<th>Action</th>
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
										<td>
											{/* Delete member button */}
											<button
												className='btn btn-sm btn-danger'
												onClick={() => handleDeleteMember(player._id)}
											>
												Remove
											</button>
										</td>
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
