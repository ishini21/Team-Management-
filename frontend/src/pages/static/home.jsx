import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.webp';

const Home = () => {
	const { isAuthenticated, role } = useAuth();
	const navigate = useNavigate();

	return (
		<div className='height-100-minus-60 d-flex align-items-center justify-content-center'>
			<div className='container'>
				<div className='row'>
					{/* Main Content */}
					<div className='col-md-8'>
						<div className='jumbotron'>
							<h1 className='display-4'>Welcome to the Society of Sport Management web portal</h1>
							<p className='lead'>Join a team to participate in upcoming events and matches.</p>

							<button
								className='btn btn-primary'
								onClick={() => {
									if (!isAuthenticated || !role) navigate('/signin');
									else navigate('/teams');
								}}
							>
								Join a Team
							</button>
						</div>
					</div>
					{/* Image */}
					<div className='col-md-4'>
						<img src={Logo} alt='Society of Sport Management logo' className='img-fluid rounded' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
