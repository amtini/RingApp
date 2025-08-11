import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Bell, 
  Users, 
  Smartphone, 
  Zap, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Star,
  Play
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Seguridad Avanzada',
      description: 'Sistema de autenticación multi-factor y encriptación de extremo a extremo para proteger tu información.',
    },
    {
      icon: Bell,
      title: 'Notificaciones Inteligentes',
      description: 'Recibe alertas en tiempo real sobre visitas, entregas y eventos importantes en tu edificio.',
    },
    {
      icon: Users,
      title: 'Gestión de Comunidad',
      description: 'Administra residentes, visitantes y personal de mantenimiento de manera eficiente.',
    },
    {
      icon: Smartphone,
      title: 'Acceso Móvil',
      description: 'Controla el acceso a tu edificio desde cualquier lugar con nuestra aplicación móvil.',
    },
    {
      icon: Zap,
      title: 'Integración IoT',
      description: 'Conecta con dispositivos inteligentes para automatizar la seguridad y el confort.',
    },
    {
      icon: Lock,
      title: 'Auditoría Completa',
      description: 'Registro detallado de todas las actividades para mantener la transparencia y seguridad.',
    },
  ]

  const pricingPlans = [
    {
      name: 'Básico',
      price: '$29',
      period: '/mes',
      description: 'Perfecto para edificios pequeños',
      features: [
        'Hasta 50 residentes',
        'Notificaciones básicas',
        'Acceso móvil',
        'Soporte por email',
        'Actualizaciones de seguridad',
      ],
      popular: false,
    },
    {
      name: 'Profesional',
      price: '$79',
      period: '/mes',
      description: 'Ideal para condominios medianos',
      features: [
        'Hasta 200 residentes',
        'Notificaciones avanzadas',
        'Gestión de visitantes',
        'Soporte prioritario',
        'API de integración',
        'Reportes personalizados',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/mes',
      description: 'Para grandes complejos residenciales',
      features: [
        'Residentes ilimitados',
        'Funciones personalizadas',
        'Soporte 24/7',
        'Integración completa',
        'Analytics avanzados',
        'Implementación dedicada',
      ],
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: 'María González',
      role: 'Administradora de Condominio',
      content: 'Cuchu ha revolucionado la gestión de nuestro edificio. La comunicación con los residentes es mucho más eficiente.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Residente',
      content: 'Me siento más seguro sabiendo que puedo controlar el acceso desde mi teléfono. Excelente servicio.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Propietaria',
      content: 'La inversión en Cuchu se ha pagado sola. Los residentes están más satisfechos y la administración es más simple.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-padding mx-auto section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              El Futuro de la{' '}
              <span className="text-accent-300">Seguridad Residencial</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Transforma tu edificio con tecnología inteligente. Gestión de acceso, 
              notificaciones en tiempo real y control total desde tu dispositivo móvil.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-primary-50"
              >
                Comenzar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <button className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600">
                <Play className="w-5 h-5 mr-2" />
                Ver Demo
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-white">
        <div className="container-padding mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4"
            >
              Características Principales
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-secondary-600 max-w-2xl mx-auto"
            >
              Diseñado para hacer tu edificio más seguro, inteligente y fácil de gestionar
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-hover text-center p-8"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-secondary-50">
        <div className="container-padding mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4"
            >
              Planes y Precios
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-secondary-600 max-w-2xl mx-auto"
            >
              Elige el plan que mejor se adapte a las necesidades de tu edificio
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card-hover relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">
                      {plan.price}
                    </span>
                    <span className="text-secondary-600">{plan.period}</span>
                  </div>
                  <p className="text-secondary-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                        <span className="text-secondary-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/register"
                    className={`w-full btn ${
                      plan.popular 
                        ? 'btn-primary' 
                        : 'btn-outline'
                    }`}
                  >
                    Comenzar Ahora
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-padding mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4"
            >
              Lo que dicen nuestros clientes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-secondary-600 max-w-2xl mx-auto"
            >
              Descubre por qué cientos de edificios confían en Cuchu
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning-500 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-secondary-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-padding mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            ¿Listo para transformar tu edificio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
          >
            Únete a cientos de edificios que ya confían en Cuchu para su seguridad y gestión
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-primary-50"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              to="/contact"
              className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Contactar Ventas
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
