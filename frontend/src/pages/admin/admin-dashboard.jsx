import { useState, useEffect } from 'react';
import { getTotals } from '../../api/teamAPI';
// import Logo from '../../assets/logo.webp'; // Import your logo here



const AdminDashboard = () => {
	const [totalTeamsCount, setTotalTeamsCount] = useState(0);
	const [gameWiseTeamsCount, setGameWiseTeamsCount] = useState({
		cricket: 0,
		volleyball: 0,
		basketball: 0
	});
	const [joinedCount, setJoinedCount] = useState(0);

	useEffect(() => {
		getTotals()
			.then((response) => {
				const { totalTeamsCount, gameWiseTeamsCount, playerCount } = response.data;
				setTotalTeamsCount(totalTeamsCount);
				setGameWiseTeamsCount(gameWiseTeamsCount);
				setJoinedCount(playerCount);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div className='container py-5 height-100-minus-60'>
			<h1 className='text-center mb-4'   style={{ color: 'black' }}>Team Manager Dashboard</h1>
			<div className='row gap-4'>
				{/* Detail Cards */}
				{/* Total Teams Count */}
				<div className='col mb-4'>
					<div className='card text-dark bg-body mb-3 col'>
						<div className='card-header'>Total Teams</div>
						<div className='card-body'>
							<h5 className='card-title'>Total Teams</h5>
							<p className='card-text'>{totalTeamsCount}</p>
						</div>
					</div>
				</div>

				{/* Game-wise Teams Count */}
				{Object.entries(gameWiseTeamsCount).map(([game, count]) => (
					<div key={game} className='col mb-4'>
						<div className='card text-dark bg-body mb-3 col'>
							<div className='card-header'>Teams</div>
							<div className='card-body'>
								<h5 className='card-title'>{game === 'cricket' ? 'Cricket' : 'Volleyball'}</h5>
								<p className='card-text'>{count}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Joined Count */}
			<div className='col mb-4'>
				<div className='card text-dark bg-body mb-3 col'>
					<div className='card-header'>Joined Player Count</div>
					<div className='card-body'>
						<h5 className='card-title'>Joined Player Count</h5>
						<p className='card-text'>{joinedCount}</p>
					</div>
				</div>
			</div>

			{/* Logo */}
			{/* <div className='col align-items-center justify-content-center'>
					<img
						src={Logo}
						alt='Society of Sport Management logo'
						className='rounded'
						style={{ maxHeight: '400px' }}
					/>
				</div> */}
		</div>
	);
};

export default AdminDashboard;
