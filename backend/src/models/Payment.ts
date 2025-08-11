import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionPlanId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: 'stripe' | 'mercadopago' | 'manual';
  gatewayTransactionId?: string;
  gatewayPaymentId?: string;
  description: string;
  metadata?: any;
  processedAt?: Date;
  refundedAt?: Date;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subscriptionPlanId: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'El monto no puede ser negativo']
  },
  currency: {
    type: String,
    required: true,
    default: 'ARS',
    enum: ['ARS', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'mercadopago', 'manual']
  },
  gatewayTransactionId: {
    type: String,
    sparse: true
  },
  gatewayPaymentId: {
    type: String,
    sparse: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  processedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundReason: {
    type: String,
    trim: true,
    maxlength: [200, 'La razón del reembolso no puede exceder 200 caracteres']
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
paymentSchema.index({ userId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ paymentMethod: 1, status: 1 });
paymentSchema.index({ gatewayTransactionId: 1 }, { sparse: true });
paymentSchema.index({ gatewayPaymentId: 1 }, { sparse: true });

// Método para marcar como procesado
paymentSchema.methods.markAsProcessed = function() {
  this.status = 'completed';
  this.processedAt = new Date();
  return this.save();
};

// Método para marcar como fallido
paymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  return this.save();
};

// Método para cancelar
paymentSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Método para reembolsar
paymentSchema.methods.refund = function(reason: string) {
  this.status = 'refunded';
  this.refundedAt = new Date();
  this.refundReason = reason;
  return this.save();
};

// Método estático para obtener pagos por usuario
paymentSchema.statics.getPaymentsByUser = function(
  userId: mongoose.Types.ObjectId,
  limit: number = 50
) {
  return this.find({ userId })
    .populate('subscriptionPlanId')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Método estático para obtener pagos por estado
paymentSchema.statics.getPaymentsByStatus = function(
  status: string,
  limit: number = 50
) {
  return this.find({ status })
    .populate('userId', 'firstName lastName email')
    .populate('subscriptionPlanId', 'name price')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Método estático para obtener estadísticas de pagos
paymentSchema.statics.getPaymentStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
};

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
