import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { registerUser } from '../../api/userAPI';

const onSubmit = async (values) => {
	try {
		const response = await registerUser(values);
		if (response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Registration Successful',
				text: 'You have successfully registered',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			}).then(() => {
				window.location.href = '/signin';
			});
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Registration Failed',
			text: "User already exists with this email or couldn't register user",
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true
		});
	}
};

const SignUp = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm();

	const password = watch('password', '');
	
	const onlyLetters = (value) => /^[A-Za-z]+$/.test(value) || ' ( Only letters are allowed )';
	
	const confirmPasswordMatch = (value) => {
		return value === password || ' Passwords do not match';
	};

	// Get today
	const today = new Date().toISOString().split('T')[0];

	return (
		<div className='d-flex justify-content-center align-items-center bg-body mb-5'>
			<div className='card text-dark bg-body mb-3 w-50'>
				<div className='card-header text-center'>Sign Up</div>
				<div className='card-body'>
					<form className='needs-validation' onSubmit={handleSubmit(onSubmit)}>
						<div className='mt-4 mb-5'>
							<div className='row'>
								{/* First Name */}
								<div className='form-group mb-4 col'>
									<label className='mb-2'>First Name</label>
									{errors.firstName && <span className='text-danger'>{errors.firstName.message}</span>}
									<input
										className='form-control'
										{...register('firstName', {
											required: ' ( required )',
											minLength: { value: 3, message: ' ( Least 3 characters long )' },
											validate: onlyLetters, // Validation to allow only letters
										})}
									/>
								</div>
								{/* Last Name */}
								<div className='form-group mb-4 col'>
									<label className='mb-2'>Last Name</label>
									{errors.lastName && <span className='text-danger'>{errors.lastName.message}</span>}
									<input
										className='form-control'
										{...register('lastName', {
											required: ' ( required )',
											minLength: { value: 3, message: ' ( Least 3 characters long )' },
											validate: onlyLetters, // Validation to allow only letters
										})}
									/>
								</div>
							</div>
							{/* Email */}
							<div className='form-group mb-4'>
								<label className='mb-2'>E-mail</label>
								{errors.email && <span className='text-danger'>{errors.email.message}</span>}
								<input
									className='form-control'
									{...register('email', {
										required: ' ( required )',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: ' ( Invalid email format )'
										}
									})}
								/>
							</div>
							<div className='row'>
								{/* Gender */}
								<div className='form-group mb-4 col'>
									<label className='mb-2'>Gender</label>
									{errors.gender && <span className='text-danger'>{errors.gender.message}</span>}
									<select className='form-control' {...register('gender', { required: ' ( required )' })}>
										<option value=''>Select gender</option>
										<option value='male'>Male</option>
										<option value='female'>Female</option>
									</select>
								</div>
								{/* Birth Day */}
								<div className='form-group mb-4 col'>
									<label className='mb-2'>Date of Birth</label>
									{errors.birthDay && <span className='text-danger'>{errors.birthDay.message}</span>}
									<input
										type='date'
										className='form-control'
										{...register('birthDay', { required: ' ( required )', max: today })}
										max={today}
									/>
								</div>
							</div>
							<div className='row'>
								{/* Password */}
								<div className='form-group col'>
									<label className='mb-2'>Password</label>
									{errors.password && <span className='text-danger'>{errors.password.message}</span>}
									<input
										type='password'
										className='form-control'
										{...register('password', {
											required: ' ( required )',
											minLength: { value: 8, message: ' ( Least 8 characters long )' }
										})}
									/>
								</div>
								{/* Confirm Password */}
								<div className='form-group col'>
									<label className='mb-2'>Confirm Password</label>
									{errors.confirmPassword && (
										<span className='text-danger'>{errors.confirmPassword.message}</span>
									)}
									<input
										type='password'
										className='form-control'
										{...register('confirmPassword', {
											required: ' ( required )',
											validate: confirmPasswordMatch
										})}
									/>
								</div>
							</div>
						</div>
						{/* Sign Up Buttton */}
						<div className='d-flex justify-content-center'>
							<button type='submit' className='btn btn-secondary'>
								Sign Up
							</button>
						</div>
					</form>
					{/* Not a member */}
					<div className='text-center mt-4'>
						<p className='mb-0'>
							Already registered? <Link to='/signin'>Sign In</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
