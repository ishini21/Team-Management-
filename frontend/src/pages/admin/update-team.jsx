import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateATeam, getTeamDetailsAdmin } from '../../api/teamAPI';

const UpdateTeam = () => {
	const { teamId } = useParams();
	const [teamInfo, setTeamInfo] = useState();
	const [players, setPlayers] = useState([]);
	const [requiredPlayers, setRequiredPlayers] = useState();

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

	// Form handling
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm();

	const gameName = watch('gameName');

	// Set required players based on game
	useEffect(() => {
		if (gameName === 'cricket') {
			setRequiredPlayers(11);
		} else if (gameName === 'volleyball') {
			setRequiredPlayers(6);
		}
	}, [gameName]);

	// Set team size to required players
	useEffect(() => {
		setValue('teamSize', requiredPlayers);
	}, [requiredPlayers, setValue]);

	// Set default values
	useEffect(() => {
		if (teamInfo) {
			setValue('teamName', teamInfo.teamName); // Set team name
			setValue('gameName', teamInfo.gameName); // Set game name
			setValue('teamSize', teamInfo.teamSize); // Set team size
			setValue('genderGroup', teamInfo.genderGroup); // Set gender group
			setValue('minAge', teamInfo.minAge); // Set minimum age
			setValue('maxAge', teamInfo.maxAge); // Set maximum age
		}
	}, [teamInfo, setValue]);

	// Validate maximum age
	const validateMaxAge = (value) => {
		const minAge = watch('minAge');
		if (value <= minAge) {
			return 'Maximum age cannot be below or same to minimum age';
		}
		return true;
	};

	// Validate team size
	const validateTeamSize = (value) => {
		if (value < teamInfo.teamSize) {
			return `Please consider already joined players and minimum needs.`;
		}
		return true;
	};

	const onSubmit = async (data) => {
		try {
			// Add the teamId to the data object
			// data.teamId = teamId;

			// Send the updated team data to the API
			const response = await updateATeam(teamId, data);

			// Check if the update was successful
			if (response.status === 200) {
				// Show success alert
				Swal.fire({
					icon: 'success',
					title: 'Success!',
					text: response.data.message,
					showConfirmButton: false,
					timer: 1500,
					timerProgressBar: true,
					willClose: () => window.location.replace('/teamlist')
				});
			} else {
				// Show error alert
				Swal.fire({
					icon: 'error',
					title: 'Error!',
					text: response.data.message
				});
			}
		} catch (error) {
			// Show error alert
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: error.message
			});
		}
	};

	return (
		<div className='container'>
			<div className='row justify-content-center'>
				<div className='col-lg-6 mb-5'>
					<h2 className='text-center mb-5'>Update a Team</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='mb-3'>
							<label className='form-label'>Team Name:</label>
							<input
								type='text'
								className='form-control'
								{...register('teamName', {
									required: 'Team name is required',
									maxLength: { value: 255, message: 'Team name must be at most 255 characters long' }
								})}
							/>
							{errors.teamName && <span className='text-danger'>{errors.teamName.message}</span>}
						</div>
						<div className='row'>
							<div className='mb-3 col'>
								<label className='form-label'>Game Name:</label>
								<select
									disabled
									className='form-select'
									{...register('gameName', { required: 'Game name is required' })}
								>
									<option value=''>Select One</option>
									<option value='cricket'>Cricket</option>
									<option value='volleyball'>Volleyball</option>
								</select>
								{errors.gameName && <span className='text-danger'>{errors.gameName.message}</span>}
							</div>
							<div className='mb-3 col'>
								<label className='form-label'>Team Size:</label>
								<input
									type='number'
									className='form-control'
									{...register('teamSize', {
										required: 'Team size is required',
										min: {
											value: 1,
											message: 'Team size must be a positive integer'
										},
										validate: validateTeamSize
									})}
								/>
								{errors.teamSize && <span className='text-danger'>{errors.teamSize.message}</span>}
							</div>
						</div>
						<div className='row'>
							<div className='mb-3 col'>
								<label className='form-label'>Gender Group:</label>
								<select
									disabled={players.length > 0}
									className='form-select'
									{...register('genderGroup', { required: 'Gender group is required' })}
								>
									<option value=''>Select One</option>
									<option value='male'>Male</option>
									<option value='female'>Female</option>
								</select>
								{errors.genderGroup && <span className='text-danger'>{errors.genderGroup.message}</span>}
							</div>
							<div className='col'></div>
						</div>
						<div className='row'>
							<div className='mb-3 col'>
								<label className='form-label'>Minimum Age:</label>
								<input
									disabled={players.length > 0}
									type='number'
									className='form-control'
									{...register('minAge', {
										required: 'Minimum age is required',
										min: { value: 19, message: 'Minimum age must be 19' }
									})}
								/>
								{errors.minAge && <span className='text-danger'>{errors.minAge.message}</span>}
							</div>
							<div className='mb-3 col'>
								<label className='form-label'>Maximum Age:</label>
								<input
									disabled={players.length > 0}
									type='number'
									className='form-control'
									{...register('maxAge', {
										required: 'Maximum age is required',
										max: {
											value: 30, // This should be the same as the maximum value in `validateMaxAge`
											message: 'Maximum age is 30', // Custom error message
										},
										validate: validateMaxAge
									})}
								/>
								{errors.maxAge && <span className='text-danger'>{errors.maxAge.message}</span>}
							</div>
						</div>
						<span className='badge bg-danger p-2 mt-4' style={{ fontSize: '16px' }}>
							Note: Total Number of players in this team - {players.length}
						</span>
						<div className='mb-3 text-center mt-5'>
							<button type='submit' className='btn btn-primary'>
								Update Team
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateTeam;
