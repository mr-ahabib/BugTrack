import express from "express";
import authRoutes from './auth.routes';
import bugRoutes from './bugRoutes';
import commentRoutes from './commentRoutes';
const router = express.Router();
router.use('/',authRoutes );
router.use('/',bugRoutes);
router.use('/', commentRoutes);
export default router;