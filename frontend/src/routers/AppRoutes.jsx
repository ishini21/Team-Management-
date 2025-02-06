import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* import all pages */
import Header from '../components/header/header.jsx';
// import Footer from '../components/footer/footer.jsx';

import * as Page from '../pages';

/* Auth Middleware */
import { ProtectedRoute } from './ProtectedRoutes.jsx';
import DashboardRoutes from './DashboardRoutes.jsx';

const routes = [
	{
		path: '/',
		element: <DashboardRoutes />,
		auth: [true, false],
		roles: ['admin', 'player', null]
	},
	{
		path: '/signup',
		element: <Page.SignUp />,
		auth: [false],
		roles: [null]
	},
	{
		path: '/signin',
		element: <Page.SignIn />,
		auth: [false],
		roles: [null]
	},
	{
		path: '/teamlist',
		element: <Page.Teams />,
		auth: [true],
		roles: ['admin']
	},
	{
		path: '/team-info/:teamId',
		element: <Page.TeamInfoAdmin />,
		auth: [true],
		roles: ['admin']
	},
	{
		path: '/teams',
		element: <Page.AllTeams />,
		auth: [true],
		roles: ['player']
	},
	{
		path: '/team/:teamId',
		element: <Page.TeamInfoM />,
		auth: [true],
		roles: ['player']
	},
	{
		path: '/add-team',
		element: <Page.AddATeam />,
		auth: [true],
		roles: ['admin']
	},
	{
		path: '/update-team/:teamId',
		element: <Page.UpdateTeam />,
		auth: [true],
		roles: ['admin']
	},
	{
		path: '*',
		element: <h1 className='container m-5 '>404 Not Found</h1>,
		auth: [true, false],
		roles: ['admin', 'player', null]
	}
];

/* AppRoutes component */
function AppRoutes() {
	return (
		<div>
			<Router>
				<Header />
				<Routes>
					{routes.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							element={<ProtectedRoute element={route.element} auth={route.auth} roles={route.roles} />}
						/>
					))}
				</Routes>
				{/* <Footer /> */}
			</Router>
		</div>
	);
}

export default AppRoutes;
