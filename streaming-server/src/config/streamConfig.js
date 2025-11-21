import { config } from './index.js';

export const streamConfigs = [
  { id: 'cam-1', name: 'Cam-01' },
  { id: 'cam-2', name: 'Cam-02' },
  { id: 'cam-3', name: 'Cam-03' },
  { id: 'cam-4', name: 'Cam-04' },
  { id: 'cam-5', name: 'Cam-05' },
  { id: 'cam-6', name: 'Cam-06' }
].slice(0, config.streaming.streamCount);



