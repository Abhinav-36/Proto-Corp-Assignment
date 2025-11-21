import express from 'express';
import {
  getStreams,
  startStream,
  stopStream,
  startAllStreams,
  stopAllStreams
} from '../controllers/streamController.js';

const router = express.Router();

router.get('/streams', getStreams);
router.post('/streams/:streamId/start', startStream);
router.post('/streams/:streamId/stop', stopStream);
router.post('/streams/start-all', startAllStreams);
router.post('/streams/stop-all', stopAllStreams);

export default router;



