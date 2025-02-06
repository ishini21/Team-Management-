import { Router } from 'express';

import { AuthAdmin, AuthPlayer } from '../middleware/auth.js';

import * as userController from '../controllers/user.controller.js';
import * as teamController from '../controllers/team.controller.js';

const router = Router();

// User routes
router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/user-data').get(AuthPlayer, userController.getUserData);

// Admin routes
router.route('/add-team').post(AuthAdmin, teamController.addTeam);
router.route('/get-all-teams').get(AuthAdmin, teamController.getAllTeams);
router.route('/team-info/:id').get(AuthAdmin, teamController.getTeamDetails);
router.route('/totals').get(AuthAdmin, teamController.getTotals);
router.route('/update-team/:id').put(AuthAdmin, teamController.updateATeam);
router.route('/remove/:id/:playerId').put(AuthAdmin, teamController.removeFromTeam);
router.route('/delete/:id').delete(AuthAdmin, teamController.deleteATeam);

// Player routes
router.route('/get-teams').get(AuthPlayer, teamController.getAllTeams);
router.route('/joined-teams').get(AuthPlayer, teamController.getJoinedTeams);
router.route('/join/:id/:gameName').put(AuthPlayer, teamController.joinATeam);
router.route('/team/:id').get(AuthPlayer, teamController.getTeamDetails);

export default router;
