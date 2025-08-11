import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getNotifications, 
  getNotificationById, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getUnreadCount 
} from '../controllers/notificationController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get user notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get specific notification
router.get('/:id', getNotificationById);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

export default router;
