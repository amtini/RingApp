import { Request, Response } from 'express';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { createStripeSubscription, createMercadoPagoSubscription } from '../services/paymentService';

interface AuthRequest extends Request {
  user?: any;
}

// Obtener todos los planes de suscripción
export const getSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });

    res.json({ plans });
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener suscripción actual del usuario
export const getCurrentSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('subscription.planId');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      subscription: user.subscription,
      plan: user.subscription?.planId
    });
  } catch (error) {
    console.error('Error getting current subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear nueva suscripción
export const createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { planId, paymentMethod, paymentToken } = req.body;

    // Verificar que el plan existe
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      res.status(400).json({ message: 'Invalid subscription plan' });
      return;
    }

    // Verificar que el usuario no tenga una suscripción activa
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.subscription && user.subscription.status === 'active') {
      res.status(400).json({ message: 'User already has an active subscription' });
      return;
    }

    let paymentResult;
    let paymentRecord;

    // Procesar pago según el método
    if (paymentMethod === 'stripe') {
      paymentResult = await createStripeSubscription(userId, planId, paymentToken);
    } else if (paymentMethod === 'mercadopago') {
      paymentResult = await createMercadoPagoSubscription(userId, planId, paymentToken);
    } else {
      res.status(400).json({ message: 'Invalid payment method' });
      return;
    }

    if (!paymentResult.success) {
      res.status(400).json({ message: paymentResult.message });
      return;
    }

    // Crear registro de pago
    paymentRecord = new Payment({
      userId,
      planId: (plan as any)._id.toString(),
      amount: plan.price,
      currency: plan.currency,
      paymentMethod,
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      metadata: paymentResult.metadata
    });

    await paymentRecord.save();

    // Actualizar suscripción del usuario
    user.subscription = {
      planId: (plan as any)._id.toString(),
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + (plan as any).duration * 24 * 60 * 60 * 1000), // Convertir días a milisegundos
      autoRenew: true
    };

    await user.save();

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: user.subscription,
      payment: paymentRecord
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Actualizar suscripción
export const updateSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { action, planId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!user.subscription || user.subscription.status !== 'active') {
      res.status(400).json({ message: 'No active subscription found' });
      return;
    }

    switch (action) {
      case 'cancel':
        user.subscription.status = 'cancelled';
        user.subscription.autoRenew = false;
        break;
      
      case 'reactivate':
        user.subscription.status = 'active';
        user.subscription.autoRenew = true;
        break;
      
      case 'change_plan':
        if (!planId) {
          res.status(400).json({ message: 'Plan ID required for plan change' });
          return;
        }
        
        const newPlan = await SubscriptionPlan.findById(planId);
        if (!newPlan || !newPlan.isActive) {
          res.status(400).json({ message: 'Invalid plan' });
          return;
        }
        
        user.subscription.planId = (newPlan as any)._id.toString();
        user.subscription.endDate = new Date(Date.now() + (newPlan as any).duration * 24 * 60 * 60 * 1000);
        break;
      
      default:
        res.status(400).json({ message: 'Invalid action' });
        return;
    }

    await user.save();

    res.json({
      message: 'Subscription updated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener suscripción por ID
export const getSubscriptionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Solo usuarios admin pueden ver suscripciones de otros usuarios
    if (id !== userId.toString() && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const user = await User.findById(id).populate('subscription.planId');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      subscription: user.subscription,
      plan: user.subscription?.planId
    });
  } catch (error) {
    console.error('Error getting subscription by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener historial de pagos del usuario
export const getUserPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const payments = await Payment.find({ userId })
      .populate('planId', 'name price duration')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Payment.countDocuments({ userId });

    res.json({
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error getting user payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear intento de pago
export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { planId, paymentMethod } = req.body;

    // Verificar que el plan existe
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      res.status(400).json({ message: 'Invalid subscription plan' });
      return;
    }

    // Verificar que el usuario no tenga una suscripción activa
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.subscription && user.subscription.status === 'active') {
      res.status(400).json({ message: 'User already has an active subscription' });
      return;
    }

    let paymentIntent;

    // Crear intento de pago según el método
    if (paymentMethod === 'stripe') {
      // Para Stripe, crear un PaymentIntent
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(plan.price * 100), // Stripe usa centavos
        currency: plan.currency,
        metadata: {
          userId: userId.toString(),
          planId: planId.toString()
        }
      });
    } else if (paymentMethod === 'mercadopago') {
      // Para MercadoPago, crear una preferencia
      const mercadopago = require('mercadopago');
      mercadopago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
      });

      const preference = {
        items: [
          {
            title: plan.name,
            unit_price: plan.price,
            quantity: 1
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/subscription/success`,
          failure: `${process.env.FRONTEND_URL}/subscription/failure`,
          pending: `${process.env.FRONTEND_URL}/subscription/pending`
        },
        external_reference: `${userId}-${planId}`,
        notification_url: `${process.env.BACKEND_URL}/api/v1/webhooks/mercadopago`
      };

      paymentIntent = await mercadopago.preferences.create(preference);
    } else {
      res.status(400).json({ message: 'Invalid payment method' });
      return;
    }

    res.json({
      paymentIntent,
      plan: {
        id: plan._id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        duration: (plan as any).duration
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ADMIN: Obtener todas las suscripciones
export const getAllSubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const { page = 1, limit = 50, status, planId } = req.query;

    const filter: any = {};
    if (status) filter['subscription.status'] = status;
    if (planId) filter['subscription.planId'] = planId;

    const users = await User.find(filter)
      .populate('subscription.planId')
      .select('email firstName lastName subscription createdAt')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      subscriptions: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error getting all subscriptions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ADMIN: Obtener estadísticas de suscripciones
export const getSubscriptionStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const stats = await User.aggregate([
      {
        $group: {
          _id: '$subscription.status',
          count: { $sum: 1 }
        }
      }
    ]);

    const planStats = await User.aggregate([
      {
        $match: { 'subscription.planId': { $exists: true } }
      },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'subscription.planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      {
        $group: {
          _id: '$plan.name',
          count: { $sum: 1 }
        }
      }
    ]);

    const revenueStats = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      planStats,
      revenueStats: revenueStats[0] || { totalRevenue: 0, totalPayments: 0 }
    });
  } catch (error) {
    console.error('Error getting subscription stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ADMIN: Cambiar estado de suscripción
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const { userId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (action === 'suspend') {
      user.isActive = false;
      if (user.subscription) {
        user.subscription.status = 'cancelled';
      }
    } else if (action === 'activate') {
      user.isActive = true;
      if (user.subscription && user.subscription.status === 'cancelled') {
        user.subscription.status = 'active';
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
      return;
    }

    await user.save();

    res.json({
      message: `User ${action === 'suspend' ? 'suspended' : 'activated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
