import Home from './static/home';

import SignIn from './signin/signin';
import SignUp from './signup/signup';

// Dashboards
import AdminDashboard from './admin/admin-dashboard';

// Admin
import Teams from './admin/teams-admin'; // It's showing the list of teams for admins
import TeamInfoAdmin from './admin/team-info-admin'; // It's showing the team info (member list, etc.)
import AddATeam from './admin/add-team'; // It's showing the form to add a new team
import UpdateTeam from './admin/update-team'; // It's showing the form to update a team

// Player
import AllTeams from './player/teams-player'; // It's showing the list of teams for players
import TeamInfoM from './player/team-info-member'; // It's showing the team info (member list, etc.)

export { Home, SignIn, SignUp, AdminDashboard, Teams, AddATeam, UpdateTeam, TeamInfoAdmin, TeamInfoM, AllTeams };
