import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Users, 
  Shield, 
  Activity, 
  Calendar, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Settings,
  LogOut,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '@stores/AuthStore'
import { useNavigate } from 'react-router-dom'

interface Notification {
  id: string
  type: 'visit' | 'delivery' | 'maintenance' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
}

interface RecentActivity {
  id: string
  type: 'access' | 'visit' | 'delivery' | 'maintenance'
  description: string
  timestamp: string
  location: string
}

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)

  useEffect(() => {
    // TODO: Fetch actual data from API
    // For now, using mock data
    setNotifications([
      {
        id: '1',
        type: 'visit',
        title: 'Visita Programada',
        message: 'María González llegará a las 15:00 para mantenimiento',
        timestamp: '2024-01-15T14:30:00Z',
        isRead: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'delivery',
        title: 'Entrega Pendiente',
        message: 'Paquete de Amazon en recepción',
        timestamp: '2024-01-15T13:15:00Z',
        isRead: true,
        priority: 'low'
      },
      {
        id: '3',
        type: 'maintenance',
        title: 'Mantenimiento Programado',
        message: 'Revisión del sistema de seguridad mañana a las 9:00',
        timestamp: '2024-01-15T12:00:00Z',
        isRead: false,
        priority: 'high'
      }
    ])

    setRecentActivities([
      {
        id: '1',
        type: 'access',
        description: 'Acceso autorizado - Tarjeta RFID',
        timestamp: '2024-01-15T14:45:00Z',
        location: 'Entrada Principal'
      },
      {
        id: '2',
        type: 'visit',
        description: 'Visita registrada - Juan Pérez',
        timestamp: '2024-01-15T14:30:00Z',
        location: 'Recepción'
      },
      {
        id: '3',
        type: 'delivery',
        description: 'Entrega recibida - DHL Express',
        timestamp: '2024-01-15T14:15:00Z',
        location: 'Recepción'
      }
    ])
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'delivery':
        return <Shield className="h-5 w-5 text-green-500" />
      case 'maintenance':
        return <Activity className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                ¡Bienvenido de vuelta, {user?.firstName}!
              </h2>
              <p className="text-blue-100">
                Tu edificio está seguro y monitoreado 24/7
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{new Date().getDate()}</p>
              <p className="text-blue-100 capitalize">
                {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Residentes Activos</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accesos Hoy</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notificaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => !n.isRead).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estado Sistema</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notificaciones Recientes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-500">
                  Ver todas
                </button>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.isRead ? 'bg-gray-50' : 'bg-white'
                    } ${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Visita
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  Contactar Portero
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(activity.timestamp)} • {activity.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {showSensitiveInfo ? '+54 9 11 1234-5678' : '••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Torre A, Piso 15</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
