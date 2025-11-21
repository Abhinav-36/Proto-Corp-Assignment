import express from 'express';
import { serveHlsFile } from '../controllers/hlsController.js';

const router = express.Router();

router.get('/hls/:streamId/:filename', serveHlsFile);

export default router;



