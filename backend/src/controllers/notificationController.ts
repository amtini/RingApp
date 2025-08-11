import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { emitToUser } from '../config/socket';

interface AuthRequest extends Request {
  user?: any;
}

// Obtener notificaciones del usuario
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type, isRead } = req.query;

    const filter: any = { userId };
    
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener notificación por ID
export const getNotificationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findOne({ _id: id, userId });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.json({ notification });
  } catch (error) {
    console.error('Error getting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener contador de notificaciones no leídas
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Marcar notificación como leída
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    // Emitir evento en tiempo real
    // emitToUser(io, userId, 'notification-read', { notificationId: id });

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    // Emitir evento en tiempo real
    // emitToUser(io, userId, 'all-notifications-read', {});

    res.json({ 
      message: 'All notifications marked as read', 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Eliminar notificación
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    // Emitir evento en tiempo real
    // emitToUser(io, userId, 'notification-deleted', { notificationId: id });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear nueva notificación
export const createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, type, title, message, priority = 'medium', data } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      priority,
      data,
      isRead: false
    });

    await notification.save();

    // Emitir evento en tiempo real
    // emitToUser(io, userId, 'new-notification', { notification });

    res.status(201).json({ 
      message: 'Notification created successfully', 
      notification 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Actualizar notificación
export const updateNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, message, priority, data } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { title, message, priority, data },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    // Emitir evento en tiempo real
    // emitToUser(io, notification.userId, 'notification-updated', { notification });

    res.json({ 
      message: 'Notification updated successfully', 
      notification 
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Eliminar todas las notificaciones del usuario
export const deleteAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ userId });

    // Emitir evento en tiempo real
    // emitToUser(io, userId, 'all-notifications-deleted', {});

    res.json({ 
      message: 'All notifications deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener estadísticas de notificaciones
export const getNotificationStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const stats = await Notification.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: ['$isRead', 0, 1] } },
          read: { $sum: { $cond: ['$isRead', 1, 0] } }
        }
      }
    ]);

    const typeStats = await Notification.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: stats[0] || { total: 0, unread: 0, read: 0 },
      typeStats
    });
  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
