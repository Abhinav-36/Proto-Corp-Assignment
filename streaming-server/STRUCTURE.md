# Project Structure

This document describes the modular structure of the streaming server.

## Directory Structure

```
streaming-server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── index.js         # Main configuration (env vars, paths)
│   │   └── streamConfig.js  # Stream definitions
│   │
│   ├── controllers/         # Route handlers (business logic)
│   │   ├── healthController.js  # Health check endpoints
│   │   ├── streamController.js  # Stream management endpoints
│   │   └── hlsController.js     # HLS file serving
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── cors.js          # CORS configuration
│   │   └── errorHandler.js  # Error handling & 404
│   │
│   ├── routes/              # Route definitions
│   │   ├── index.js         # Main router (mounts all routes)
│   │   ├── healthRoutes.js  # Health check routes
│   │   ├── streamRoutes.js  # Stream management routes
│   │   └── hlsRoutes.js     # HLS serving routes
│   │
│   ├── utils/               # Utility functions
│   │   └── ffmpegManager.js # FFmpeg process management
│   │
│   └── server.js            # Main server file (entry point)
│
├── outputs/                 # HLS output directory (generated)
├── package.json
├── .env.example
└── README.md
```

## Module Responsibilities

### `config/`
- **index.js**: Loads environment variables and exports centralized configuration
- **streamConfig.js**: Defines available stream configurations (cam-master, cam-alpha, etc.)

### `controllers/`
- **healthController.js**: Handles `/api/health` endpoint
- **streamController.js**: Handles stream CRUD operations (get, start, stop)
- **hlsController.js**: Serves HLS playlists and video segments

### `middlewares/`
- **cors.js**: CORS configuration middleware
- **errorHandler.js**: Global error handler and 404 handler

### `routes/`
- **index.js**: Main router that mounts all route modules
- **healthRoutes.js**: Health check routes
- **streamRoutes.js**: Stream management routes (`/api/streams/*`)
- **hlsRoutes.js**: HLS file serving routes (`/api/hls/*`)

### `utils/`
- **ffmpegManager.js**: 
  - Manages FFmpeg process lifecycle
  - Start/stop streams
  - Track active streams
  - Auto-restart on failure

### `server.js`
- Entry point
- Initializes Express app
- Applies middlewares
- Mounts routes
- Starts server
- Handles graceful shutdown

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Testability**: Controllers and utils can be tested independently
4. **Scalability**: Easy to add new routes, controllers, or utilities
5. **Code Reusability**: Utils can be shared across controllers

## Adding New Features

### Adding a New Route
1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Mount route in `routes/index.js`

### Adding a New Utility
1. Create file in `utils/`
2. Export functions
3. Import where needed

### Adding Configuration
1. Add to `config/index.js` or create new config file
2. Import in modules that need it



