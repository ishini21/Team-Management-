import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAllTeams, deleteATeam } from '../../api/teamAPI';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Teams = () => {
	const navigate = useNavigate();
	const [teams, setTeams] = useState([]);

	// useEffect for data fetching
	useEffect(() => {
		fetchAllTeams();
	}, []);

	// Fetch all teams
	const fetchAllTeams = async () => {
		try {
			const response = await getAllTeams();
			setTeams(response.data);
		} catch (error) {
			console.error('Error fetching teams: ', error);
		}
	};

	// Delete handler
	const handleDelete = async (teamId) => {
		try {
			const confirm = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this team!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!',
				cancelButtonText: 'No, keep it'
			});

			if (confirm.isConfirmed) {
				const response = await deleteATeam(teamId);
				if (response.status === 200) {
					Swal.fire('Deleted!', 'Your team has been deleted.', 'success');
					fetchAllTeams();
				}
			}
		} catch (error) {
			console.error('Error deleting team: ', error);
		}
	};

	// Report handler
	const reportHandler = async () => {
		const doc = new jsPDF();

		// Calculate total teams
		const totalTeams = teams.length;

		// Total players
		const totalPlayers = teams.reduce((acc, team) => acc + team.playerIds.length, 0);

		// Add header
		const headerTitle = 'Teams Report';
		const headerTitleX = doc.internal.pageSize.width / 2;
		doc.setFontSize(12);
		doc.text(headerTitle, headerTitleX, 10, { align: 'center' });

		// Table header
		doc.autoTable({
			head: [['Team Name', 'Game Name', 'Gender Group', 'Age Limit', 'Players']],
			body: teams.map((team) => [
				team.teamName,
				team.gameName === 'cricket' ? 'Cricket' : 'VolleyBall',
				team.genderGroup === 'male' ? 'Male' : 'Female',
				`${team.minAge} - ${team.maxAge}`,
				`${team.playerIds.length} / ${team.teamSize}`
			])
		});

		let currentY = doc.autoTable.previous.finalY + 10;

		// total teams
		doc.text(`Total Teams: ${totalTeams}`, 14, currentY);

		// Total Players
		doc.text(`Total Players: ${totalPlayers}`, 14, currentY + 10);

		// Save the PDF
		doc.save('teams-report.pdf');
	};

	// View handler
	const handleView = async (teamId) => {
		navigate(`/team-info/${teamId}`);
	};

	// Update handler
	const handleUpdate = async (teamId) => {
		navigate(`/update-team/${teamId}`);
	};

	return (
		
		<div className='container'>
			<div>
				<button type='button' onClick={() => navigate('/add-team')} className='btn border border-dark'>
					Add a New Team
				</button>
			</div>
			{/* Teams Table */}
			<div>
				<div className='d-flex my-4'>
					<h2>Team List</h2>
					<button className='btn btn-primary my-1 ms-auto' onClick={reportHandler}>
						Download Report
					</button>
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
								<td className='d-flex align-items-center justify-content-center'>
									<button
										type='button'
										onClick={() => handleView(team._id)}
										className='btn btn-sm btn-primary me-2'
									>
										View
									</button>
									<button
										type='button'
										onClick={() => handleUpdate(team._id)}
										className='btn btn-sm btn-secondary me-2'
									>
										Update
									</button>
									<button
										type='button'
										onClick={() => handleDelete(team._id)}
										className='btn btn-sm btn-danger'
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
		
	);
};

export default Teams;
