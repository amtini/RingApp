import { Router, Request, Response } from 'express';
import { processStripeWebhook, processMercadoPagoWebhook } from '../services/paymentService';

const router = Router();

// Webhook de Stripe
router.post('/stripe', async (req: Request, res: Response) => {
  try {
    const event = req.body;
    
    // Verificar que el evento viene de Stripe (en producción, verificar la firma)
    if (process.env.NODE_ENV === 'production') {
      // Aquí deberías verificar la firma del webhook
      // const signature = req.headers['stripe-signature'];
      // event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
    
    const result = await processStripeWebhook(event);
    
    if (result.success) {
      res.json({ received: true });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Webhook de MercadoPago
router.post('/mercadopago', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    const result = await processMercadoPagoWebhook(data);
    
    if (result.success) {
      res.json({ received: true });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

export default router;
