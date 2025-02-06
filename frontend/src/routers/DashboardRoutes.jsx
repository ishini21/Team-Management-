import { Home, AdminDashboard } from '../pages';
import { useAuth } from '../hooks/useAuth';

const DashboardRoutes = () => {
	const { isAuthenticated, role } = useAuth();

	if (isAuthenticated) {
		if (role === 'player') {
			return <Home />;
		} else if (role === 'admin') {
			return <AdminDashboard />;
		}
	} else {
		return <Home />;
	}
};

export default DashboardRoutes;
