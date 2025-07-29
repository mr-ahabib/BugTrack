import express from "express";
import authRoutes from './auth.routes';
import bugRoutes from './bugRoutes';
const router = express.Router();
router.use('/',authRoutes );
router.use('/',bugRoutes)
export default router;