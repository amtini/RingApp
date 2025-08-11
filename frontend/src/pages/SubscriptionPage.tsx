import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, CreditCard, Calendar, Users, Shield, Zap, Lock, Bell, Phone } from 'lucide-react'
import { useAuth } from '@stores/AuthStore'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular: boolean
  maxResidents: number
  maxNotifications: number
  support: string
  integrations: string[]
}

const SubscriptionPage = () => {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 29,
      period: 'mes',
      description: 'Perfecto para edificios pequeños',
      features: [
        'Hasta 50 residentes',
        'Notificaciones básicas',
        'Acceso móvil',
        'Soporte por email',
        'Actualizaciones de seguridad',
        '1 usuario administrador'
      ],
      popular: false,
      maxResidents: 50,
      maxNotifications: 100,
      support: 'Email',
      integrations: ['API básica']
    },
    {
      id: 'professional',
      name: 'Profesional',
      price: 79,
      period: 'mes',
      description: 'Ideal para condominios medianos',
      features: [
        'Hasta 200 residentes',
        'Notificaciones avanzadas',
        'Gestión de visitantes',
        'Soporte prioritario',
        'API de integración',
        'Reportes personalizados',
        '3 usuarios administradores',
        'Integración con cámaras'
      ],
      popular: true,
      maxResidents: 200,
      maxNotifications: 500,
      support: 'Prioritario + Chat',
      integrations: ['API completa', 'Cámaras', 'Sistemas de acceso']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'mes',
      description: 'Para grandes complejos residenciales',
      features: [
        'Residentes ilimitados',
        'Funciones personalizadas',
        'Soporte 24/7',
        'Integración completa',
        'Analytics avanzados',
        'Implementación dedicada',
        'Usuarios administradores ilimitados',
        'Sistema de backup automático',
        'Compliance y auditoría'
      ],
      popular: false,
      maxResidents: -1,
      maxNotifications: -1,
      support: '24/7 + Dedicado',
      integrations: ['API completa', 'Sistemas empresariales', 'IoT avanzado']
    }
  ]

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true)
      setSelectedPlan(planId)
      
      // TODO: Implement actual subscription logic
      // await subscriptionService.subscribe(planId)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message or redirect to payment
      console.log(`Subscribed to plan: ${planId}`)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentPlan = () => {
    // TODO: Get from user subscription data
    return user?.subscription?.planId || null
  }

  const isCurrentPlan = (planId: string) => {
    return getCurrentPlan() === planId
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Planes de Suscripción
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Elige el plan que mejor se adapte a las necesidades de tu edificio
          </motion.p>
        </div>

        {/* Current Plan Banner */}
        {getCurrentPlan() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Plan Actual: {plans.find(p => p.id === getCurrentPlan())?.name}
                  </h3>
                  <p className="text-blue-700">
                    Tu suscripción está activa y funcionando correctamente
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors">
                Gestionar Suscripción
              </button>
            </div>
          </motion.div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                plan.popular 
                  ? 'border-blue-500 ring-4 ring-blue-100' 
                  : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 ml-1">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Current Plan Badge */}
                  {isCurrentPlan(plan.id) && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                      <Check className="h-4 w-4 mr-1" />
                      Plan Actual
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Plan Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {plan.maxResidents === -1 ? 'Ilimitados' : `Hasta ${plan.maxResidents}`} residentes
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {plan.maxNotifications === -1 ? 'Ilimitadas' : `${plan.maxNotifications}`} notificaciones
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{plan.support}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{plan.integrations.length} integraciones</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || isCurrentPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isCurrentPlan(plan.id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    'Procesando...'
                  ) : isCurrentPlan(plan.id) ? (
                    'Plan Actual'
                  ) : (
                    'Suscribirse'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas algo más personalizado?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Si tienes requisitos específicos o necesitas un plan personalizado, 
              nuestro equipo está aquí para ayudarte a encontrar la solución perfecta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Facturación Flexible</h4>
              <p className="text-gray-600">
                Facturación mensual o anual con descuentos por volumen
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-lg inline-flex mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Prueba Gratuita</h4>
              <p className="text-gray-600">
                14 días de prueba gratuita para evaluar la plataforma
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-4">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Seguridad Garantizada</h4>
              <p className="text-gray-600">
                Certificaciones de seguridad y cumplimiento de normativas
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Contactar Ventas
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubscriptionPage
