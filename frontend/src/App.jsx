import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppRoutes from './routers/AppRoutes';

function App() {
	return (
		<>
			<div className='main-content'>
				<AppRoutes />
			</div>
		</>
	);
}

export default App;
