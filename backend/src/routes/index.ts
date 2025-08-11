import { Router } from 'express';
import authRoutes from './authRoutes';
import notificationRoutes from './notificationRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import webhookRoutes from './webhookRoutes';

const router = Router();

// API version prefix
const API_VERSION = '/v1';

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/notifications`, notificationRoutes);
router.use(`${API_VERSION}/subscriptions`, subscriptionRoutes);

// Webhook routes (no version prefix)
router.use('/webhooks', webhookRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: `${API_VERSION}/auth`,
      notifications: `${API_VERSION}/notifications`,
      subscriptions: `${API_VERSION}/subscriptions`
    }
  });
});

export default router;
