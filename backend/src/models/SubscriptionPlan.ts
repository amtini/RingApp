import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxUsers?: number;
  maxNotifications?: number;
  maxStorage?: number;
  isActive: boolean;
  stripePriceId?: string;
  mercadopagoPriceId?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  },
  currency: {
    type: String,
    required: true,
    default: 'ARS',
    enum: ['ARS', 'USD', 'EUR']
  },
  interval: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  features: [{
    type: String,
    trim: true
  }],
  maxUsers: {
    type: Number,
    min: [1, 'Debe permitir al menos 1 usuario']
  },
  maxNotifications: {
    type: Number,
    min: [0, 'El límite de notificaciones no puede ser negativo']
  },
  maxStorage: {
    type: Number,
    min: [0, 'El almacenamiento no puede ser negativo']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stripePriceId: {
    type: String
  },
  mercadopagoPriceId: {
    type: String
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
subscriptionPlanSchema.index({ isActive: 1, sortOrder: 1 });
subscriptionPlanSchema.index({ price: 1 });
subscriptionPlanSchema.index({ interval: 1 });

// Virtual para precio anual si es plan mensual
subscriptionPlanSchema.virtual('annualPrice').get(function() {
  if (this.interval === 'monthly') {
    return this.price * 12;
  }
  return this.price;
});

// Virtual para precio mensual si es plan anual
subscriptionPlanSchema.virtual('monthlyPrice').get(function() {
  if (this.interval === 'yearly') {
    return this.price / 12;
  }
  return this.price;
});

// Método para verificar si el plan está disponible
subscriptionPlanSchema.methods.isAvailable = function(): boolean {
  return this.isActive;
};

// Método estático para obtener planes activos ordenados
subscriptionPlanSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, price: 1 });
};

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);
