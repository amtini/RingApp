import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createSubscription,
  updateSubscription,
  getSubscriptionById,
  getUserPayments,
  createPaymentIntent,
  getAllSubscriptions,
  getSubscriptionStats,
  toggleUserStatus
} from '../controllers/subscriptionController';

const router = Router();

// Rutas públicas
router.get('/plans', getSubscriptionPlans);

// Rutas protegidas
router.use(authenticateToken);

router.get('/current', getCurrentSubscription);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.get('/:id', getSubscriptionById);
router.get('/payments', getUserPayments);
router.post('/create-payment-intent', createPaymentIntent);

// Rutas de admin
router.get('/admin/all', getAllSubscriptions);
router.get('/admin/stats', getSubscriptionStats);
router.put('/admin/users/:userId/status', toggleUserStatus);

export default router;
