import nodemailer from 'nodemailer';

// Configurar transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Enviar email de bienvenida
export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@cuchu.com',
      to: email,
      subject: '¡Bienvenido a Cuchu! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">¡Hola ${firstName}!</h1>
          <p>Te damos la bienvenida a <strong>Cuchu</strong>, tu portero virtual inteligente.</p>
          <p>Con Cuchu podrás:</p>
          <ul>
            <li>Recibir notificaciones en tiempo real</li>
            <li>Gestionar visitas de forma segura</li>
            <li>Acceder a tu hogar desde cualquier lugar</li>
            <li>Mantener un historial completo de actividades</li>
          </ul>
          <p>¡Gracias por confiar en nosotros!</p>
          <p>El equipo de Cuchu</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Enviar email de reset de contraseña
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@cuchu.com',
      to: email,
      subject: 'Reset de Contraseña - Cuchu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset de Contraseña</h1>
          <p>Has solicitado resetear tu contraseña en Cuchu.</p>
          <p>Haz clic en el siguiente enlace para continuar:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Resetear Contraseña
          </a>
          <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
          <p>Este enlace expira en 1 hora.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Enviar email de notificación
export const sendNotificationEmail = async (email: string, notification: any): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@cuchu.com',
      to: email,
      subject: `Notificación: ${notification.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${notification.title}</h2>
          <p>${notification.message}</p>
          <p><strong>Fecha:</strong> ${new Date(notification.createdAt).toLocaleString()}</p>
          <p><strong>Prioridad:</strong> ${notification.priority}</p>
          <p>Accede a tu cuenta para más detalles.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
};

// Enviar email de suscripción
export const sendSubscriptionEmail = async (email: string, subscription: any, action: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    let subject = '';
    let message = '';
    
    switch (action) {
      case 'activated':
        subject = '¡Suscripción Activada! 🎉';
        message = `Tu suscripción a ${subscription.planName} ha sido activada exitosamente.`;
        break;
      case 'cancelled':
        subject = 'Suscripción Cancelada';
        message = `Tu suscripción ha sido cancelada. Podrás reactivarla en cualquier momento.`;
        break;
      case 'expired':
        subject = 'Suscripción Expirada';
        message = `Tu suscripción ha expirado. Renueva para continuar disfrutando de todos los beneficios.`;
        break;
      default:
        subject = 'Actualización de Suscripción';
        message = `Tu suscripción ha sido actualizada.`;
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@cuchu.com',
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${subject}</h1>
          <p>${message}</p>
          <p><strong>Plan:</strong> ${subscription.planName || 'N/A'}</p>
          <p><strong>Estado:</strong> ${subscription.status}</p>
          <p><strong>Fecha de expiración:</strong> ${subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}</p>
          <p>Accede a tu cuenta para gestionar tu suscripción.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending subscription email:', error);
    throw error;
  }
};

// Enviar email de factura
export const sendInvoiceEmail = async (email: string, invoice: any): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@cuchu.com',
      to: email,
      subject: `Factura #${invoice.number} - Cuchu`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Factura #${invoice.number}</h1>
          <p><strong>Fecha:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
          <p><strong>Plan:</strong> ${invoice.planName}</p>
          <p><strong>Monto:</strong> $${invoice.amount} ${invoice.currency}</p>
          <p><strong>Estado:</strong> ${invoice.status}</p>
          <p>Gracias por tu suscripción a Cuchu.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};
