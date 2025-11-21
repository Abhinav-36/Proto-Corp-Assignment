import express from 'express';
import healthRoutes from './healthRoutes.js';
import streamRoutes from './streamRoutes.js';
import hlsRoutes from './hlsRoutes.js';

const router = express.Router();

// Mount route modules
router.use('/api', healthRoutes);
router.use('/api', streamRoutes);
router.use('/api', hlsRoutes);

export default router;



