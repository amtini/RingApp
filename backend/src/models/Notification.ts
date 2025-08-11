import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'doorbell' | 'message' | 'video_call' | 'payment' | 'subscription' | 'system';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  readAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['doorbell', 'message', 'video_call', 'payment', 'subscription', 'system'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'El mensaje no puede exceder 1000 caracteres']
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
    index: true
  },
  readAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, status: 1 });
notificationSchema.index({ priority: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Método para marcar como leída
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Método para archivar
notificationSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Método estático para obtener notificaciones no leídas de un usuario
notificationSchema.statics.getUnreadNotifications = function(userId: mongoose.Types.ObjectId) {
  return this.find({
    userId,
    status: 'unread'
  }).sort({ createdAt: -1 });
};

// Método estático para obtener notificaciones por tipo
notificationSchema.statics.getNotificationsByType = function(
  userId: mongoose.Types.ObjectId,
  type: string,
  limit: number = 50
) {
  return this.find({
    userId,
    type
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Método estático para limpiar notificaciones expiradas
notificationSchema.statics.cleanExpiredNotifications = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
