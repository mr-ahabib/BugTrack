import express from 'express';
import upload from '../middleware/upload';
import { createBug, findBugsByUserId, findAllBugs, updateBugAssignedTo } from '../controllers/bugController';

import { authenticate } from '../middleware/auth';
import { isReporter } from '../middleware/isReporter';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

router.post('/createBug', authenticate,isReporter, upload.single('screenshot'), createBug);
router.get('/mybugs', authenticate, findBugsByUserId);
router.get('/allbugs', authenticate,isAdmin,findAllBugs);
router.put('/bugs/:id/assign/:assigned_to', authenticate,isAdmin, updateBugAssignedTo);
export default router;