import {Router} from 'express';
import {verifyToken} from '../middlewares/AuthMiddleware.js';
import {createGroup, getGroups, getGroupMessages} from '../controllers/GroupController.js';

const GroupsRouter = Router();

GroupsRouter.post('/create-group', verifyToken, createGroup);
GroupsRouter.get('/get-groups', verifyToken, getGroups);
GroupsRouter.post('/get-group-messages', verifyToken, getGroupMessages);

export default GroupsRouter;