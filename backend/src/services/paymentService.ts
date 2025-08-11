import Stripe from 'stripe';
import mercadopago from 'mercadopago';

// Configurar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Configurar MercadoPago solo si hay token
let mercadopagoConfigured = false;
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  try {
    (mercadopago as any).configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    mercadopagoConfigured = true;
  } catch (error) {
    console.warn('MercadoPago configuration failed:', error);
  }
}

// Crear suscripción en Stripe
export const createStripeSubscription = async (userId: string, planId: string, paymentToken: string) => {
  try {
    // Crear o obtener customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userId // Asumiendo que userId es el email
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userId,
        metadata: {
          userId: userId
        }
      });
    }

    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // $20.00 en centavos
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentToken,
      confirm: true,
      metadata: {
        userId: userId,
        planId: planId
      }
    });

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentId: paymentIntent.id,
        status: 'completed',
        metadata: {
          customerId: customer.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }
      };
    } else {
      return {
        success: false,
        message: 'Payment failed',
        status: paymentIntent.status
      };
    }
  } catch (error) {
    console.error('Error creating Stripe subscription:', error);
    return {
      success: false,
      message: 'Error processing Stripe payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Crear suscripción en MercadoPago
export const createMercadoPagoSubscription = async (userId: string, planId: string, paymentToken: string) => {
  try {
    if (!mercadopagoConfigured) {
      return {
        success: false,
        message: 'MercadoPago not configured'
      };
    }

    // Crear preferencia de pago
    const preference = {
      items: [
        {
          title: 'Suscripción Cuchu',
          unit_price: 20.00,
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

    const response = await (mercadopago as any).preferences.create(preference);

    return {
      success: true,
      paymentId: response.body.id,
      status: 'pending',
      metadata: {
        preferenceId: response.body.id,
        initPoint: response.body.init_point
      }
    };
  } catch (error) {
    console.error('Error creating MercadoPago subscription:', error);
    return {
      success: false,
      message: 'Error processing MercadoPago payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Procesar webhook de Stripe
export const processStripeWebhook = async (event: any) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Aquí puedes actualizar la base de datos
        // await updateSubscriptionStatus(paymentIntent.metadata.userId, 'active');
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
        
      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log('Subscription created:', subscription.id);
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Subscription deleted:', deletedSubscription.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Procesar webhook de MercadoPago
export const processMercadoPagoWebhook = async (data: any) => {
  try {
    const { type, data: webhookData } = data;
    
    switch (type) {
      case 'payment':
        const payment = webhookData;
        console.log('Payment received:', payment.id);
        
        if (payment.status === 'approved') {
          // Pago aprobado
          console.log('Payment approved:', payment.id);
          // await updateSubscriptionStatus(payment.external_reference.split('-')[0], 'active');
        } else if (payment.status === 'rejected') {
          // Pago rechazado
          console.log('Payment rejected:', payment.id);
        } else if (payment.status === 'pending') {
          // Pago pendiente
          console.log('Payment pending:', payment.id);
        }
        break;
        
      case 'subscription_preapproval':
        const subscription = webhookData;
        console.log('Subscription preapproval:', subscription.id);
        break;
        
      default:
        console.log(`Unhandled MercadoPago event type: ${type}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Obtener información de pago de Stripe
export const getStripePaymentInfo = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      payment: paymentIntent
    };
  } catch (error) {
    console.error('Error getting Stripe payment info:', error);
    return {
      success: false,
      message: 'Error retrieving payment information'
    };
  }
};

// Obtener información de pago de MercadoPago
export const getMercadoPagoPaymentInfo = async (paymentId: string) => {
  try {
    if (!mercadopagoConfigured) {
      return {
        success: false,
        message: 'MercadoPago not configured'
      };
    }

    const payment = await (mercadopago as any).payment.get(paymentId);
    return {
      success: true,
      payment: payment.body
    };
  } catch (error) {
    console.error('Error getting MercadoPago payment info:', error);
    return {
      success: false,
      message: 'Error retrieving payment information'
    };
  }
};

// Reembolsar pago en Stripe
export const refundStripePayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount // Si no se especifica, se reembolsa todo
    });
    
    return {
      success: true,
      refund: refund
    };
  } catch (error) {
    console.error('Error refunding Stripe payment:', error);
    return {
      success: false,
      message: 'Error processing refund'
    };
  }
};

// Cancelar suscripción en Stripe
export const cancelStripeSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    
    return {
      success: true,
      subscription: subscription
    };
  } catch (error) {
    console.error('Error canceling Stripe subscription:', error);
    return {
      success: false,
      message: 'Error canceling subscription'
    };
  }
};
