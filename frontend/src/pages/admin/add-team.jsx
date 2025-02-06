import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { addTeam } from '../../api/teamAPI';

const AddATeam = () => {
	const [requiredPlayers, setRequiredPlayers] = useState();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm();

	const gameName = watch('gameName');

	useEffect(() => {
		if (gameName === 'cricket') {
			setRequiredPlayers(11);
		} else if (gameName === 'volleyball') {
			setRequiredPlayers(6);
		}
	}, [gameName]);

	useEffect(() => {
		setValue('teamSize', requiredPlayers);
	}, [requiredPlayers, setValue]);

	const validateMaxAge = (value) => {
		const minAge = watch('minAge');
		if (value <= minAge) {
			return 'Maximum age cannot be below or same to minimum age';
		}
		return true;
	};

	const validateTeamSize = (value) => {
		if (value < requiredPlayers) {
			return `Team size must be at least ${requiredPlayers} for ${gameName}`;
		}
		return true;
	};

	const onSubmit = async (data) => {
		try {
			const response = await addTeam(data);
			if (response.status === 201) {
				Swal.fire({
					icon: 'success',
					title: 'Success!',
					text: response.data.message,
					showConfirmButton: false,
					timer: 1500,
					timerProgressBar: true,
					willClose: () => window.location.replace('/teamlist')
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: error.data.message
			});
		}
	};

	return (
		<div className='container'>
			<div className='row justify-content-center'>
				<div className='col-lg-6 mb-5'>
					<h2 className='text-center mb-5'>Add a New Team</h2>
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
									type='number'
									className='form-control'
									{...register('maxAge', {
										required: 'Maximum age is required',
										validate: validateMaxAge,
										max: {
											value: 30, // This should be the same as the maximum value in `validateMaxAge`
											message: 'Maximum age is 30', // Custom error message
										},
									})}
								/>
								{errors.maxAge && <span className='text-danger'>{errors.maxAge.message}</span>}
							</div>
						</div>
						<div className='mb-3 text-center mt-5'>
							<button type='submit' className='btn btn-primary'>
								Add Team
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddATeam;
