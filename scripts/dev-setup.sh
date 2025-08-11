#!/bin/bash

# Cuchu Development Setup Script
echo "🚀 Configurando entorno de desarrollo para Cuchu..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Create necessary directories
echo "📁 Creando directorios necesarios..."
mkdir -p backend/scripts
mkdir -p logs

# Create environment files from examples
echo "🔧 Configurando archivos de entorno..."

# Backend .env
if [ ! -f backend/.env ]; then
    echo "📝 Creando backend/.env desde env.example..."
    cp backend/env.example backend/.env
    echo "⚠️  IMPORTANTE: Edita backend/.env con tus credenciales reales"
else
    echo "✅ backend/.env ya existe"
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    echo "📝 Creando frontend/.env desde env.example..."
    cp frontend/env.example frontend/.env
    echo "⚠️  IMPORTANTE: Edita frontend/.env con tus credenciales reales"
else
    echo "✅ frontend/.env ya existe"
fi

# Create MongoDB initialization script
echo "🗄️  Creando script de inicialización de MongoDB..."
cat > backend/scripts/init-mongo.js << 'EOF'
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
EOF

# Install dependencies
echo "📦 Instalando dependencias..."

# Backend dependencies
echo "🔧 Instalando dependencias del backend..."
cd backend
npm install
cd ..

# Frontend dependencies
echo "🎨 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

# Make script executable
chmod +x scripts/dev-setup.sh

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita backend/.env con tus credenciales reales"
echo "2. Edita frontend/.env con tus credenciales reales"
echo "3. Ejecuta: docker-compose up -d"
echo "4. Accede a la aplicación en: http://localhost:3000"
echo "5. Accede a MongoDB Express en: http://localhost:8081"
echo "6. Accede a Redis Commander en: http://localhost:8082"
echo ""
echo "🛠️  Comandos útiles:"
echo "  - Iniciar: docker-compose up -d"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Detener: docker-compose down"
echo "  - Reconstruir: docker-compose up -d --build"
echo ""
echo "📚 Documentación: README.md"
echo ""
