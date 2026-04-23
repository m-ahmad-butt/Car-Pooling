const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { corsOptions } = require('./config/cors');
const { rateLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler } = require('./middleware/errorHandler.middleware');
const { clerkAuth } = require('./middleware/auth.middleware');

const authRoutes = require('./routes/auth.routes');
const rideRoutes = require('./routes/ride.routes');
const requestRoutes = require('./routes/request.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.set('trust proxy', true);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'carpooling-backend-monolith'
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Car Pooling Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rides', clerkAuth, rideRoutes);
app.use('/api/requests', clerkAuth, requestRoutes);
app.use('/api/reviews', clerkAuth, reviewRoutes);
app.use('/api/notifications', clerkAuth, notificationRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
