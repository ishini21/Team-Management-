import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

/* Protected Route component */
export const ProtectedRoute = ({ element, auth, roles }) => {
	const { isAuthenticated, role } = useAuth();

	if (!auth.includes(isAuthenticated) || !roles.includes(role)) {
		return <Navigate to={'/'} replace={true} />;
	}
	return element;
};

ProtectedRoute.propTypes = {
	element: PropTypes.node.isRequired,
	auth: PropTypes.arrayOf(PropTypes.bool).isRequired,
	roles: PropTypes.arrayOf(PropTypes.string).isRequired
};
