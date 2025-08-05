import express from 'express';
import { authenticate } from '../middleware/auth';
import { createComment, getCommentsByBugId } from '../controllers/commentController';



const router = express.Router();
router.post('/CreateComment/:bug_id', authenticate, createComment);
router.get('/comments/:bug_id', authenticate, getCommentsByBugId);

export default router;