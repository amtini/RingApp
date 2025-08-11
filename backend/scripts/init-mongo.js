// MongoDB initialization script
db = db.getSiblingDB('cuchu');

// Create collections
db.createCollection('users');
db.createCollection('notifications');
db.createCollection('subscriptionplans');
db.createCollection('payments');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "googleId": 1 });
db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
db.notifications.createIndex({ "userId": 1, "status": 1 });
db.subscriptionplans.createIndex({ "isActive": 1 });
db.payments.createIndex({ "userId": 1, "createdAt": -1 });

// Insert default subscription plans
db.subscriptionplans.insertMany([
  {
    name: "Básico",
    description: "Plan básico para uso personal",
    price: 9.99,
    currency: "USD",
    interval: "monthly",
    features: [
      "Notificaciones básicas",
      "Acceso web",
      "Soporte por email"
    ],
    isActive: true,
    stripePriceId: "price_basic_monthly",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Profesional",
    description: "Plan profesional para negocios",
    price: 19.99,
    currency: "USD",
    interval: "monthly",
    features: [
      "Todas las características del plan básico",
      "Videollamadas",
      "Historial completo",
      "Soporte prioritario",
      "API access"
    ],
    isActive: true,
    stripePriceId: "price_professional_monthly",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Empresarial",
    description: "Plan empresarial para grandes organizaciones",
    price: 49.99,
    currency: "USD",
    interval: "monthly",
    features: [
      "Todas las características del plan profesional",
      "Múltiples usuarios",
      "Analytics avanzados",
      "Soporte 24/7",
      "Integraciones personalizadas"
    ],
    isActive: true,
    stripePriceId: "price_enterprise_monthly",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ Base de datos 'cuchu' inicializada correctamente");
print("✅ Colecciones creadas");
print("✅ Índices creados");
print("✅ Planes de suscripción por defecto insertados");
