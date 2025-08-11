import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff,
  Camera,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@stores/AuthStore'
import { cn } from '@utils/cn'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    privacy: {
      showPhone: boolean
      showAddress: boolean
    }
  }
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '+54 9 11 1234-5678', // Mock data
      address: 'Torre A, Piso 15, Dpto 1501', // Mock data
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: false
        },
        privacy: {
          showPhone: false,
          showAddress: false
        }
      }
    }
  })

  const passwordForm = useForm<PasswordForm>()

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      setIsLoading(true)
      setMessage(null)
      
      // TODO: Implement actual API call
      // await userService.updateProfile(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        })
      }
      
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' })
      setIsEditing(false)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil' })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      setIsLoading(true)
      setMessage(null)
      
      if (data.newPassword !== data.confirmPassword) {
        setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
        return
      }
      
      // TODO: Implement actual API call
      // await userService.changePassword(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' })
      setIsChangingPassword(false)
      passwordForm.reset()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al cambiar contraseña' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    profileForm.reset()
    setMessage(null)
  }

  const handleCancelPassword = () => {
    setIsChangingPassword(false)
    passwordForm.reset()
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Mi Perfil
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Gestiona tu información personal y preferencias
          </motion.p>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Información Personal</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="h-24 w-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        {...profileForm.register('firstName', {
                          required: 'El nombre es requerido'
                        })}
                        type="text"
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                          !isEditing ? "bg-gray-50 text-gray-500" : "bg-white",
                          profileForm.formState.errors.firstName ? "border-red-300" : "border-gray-300"
                        )}
                      />
                    </div>
                    {profileForm.formState.errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        {...profileForm.register('lastName', {
                          required: 'El apellido es requerido'
                        })}
                        type="text"
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                          !isEditing ? "bg-gray-50 text-gray-500" : "bg-white",
                          profileForm.formState.errors.lastName ? "border-red-300" : "border-gray-300"
                        )}
                      />
                    </div>
                    {profileForm.formState.errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...profileForm.register('email', {
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                      type="email"
                      disabled={!isEditing}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                        !isEditing ? "bg-gray-50 text-gray-500" : "bg-white",
                        profileForm.formState.errors.email ? "border-red-300" : "border-gray-300"
                      )}
                    />
                  </div>
                  {profileForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...profileForm.register('phone')}
                      type="tel"
                      disabled={!isEditing}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                        !isEditing ? "bg-gray-50 text-gray-500" : "bg-white",
                        profileForm.formState.errors.phone ? "border-red-300" : "border-gray-300"
                      )}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      {...profileForm.register('address')}
                      type="text"
                      disabled={!isEditing}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                        !isEditing ? "bg-gray-50 text-gray-500" : "bg-white",
                        profileForm.formState.errors.address ? "border-red-300" : "border-gray-300"
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cambiar Contraseña
                </button>
              ) : (
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('currentPassword', {
                          required: 'La contraseña actual es requerida'
                        })}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('newPassword', {
                          required: 'La nueva contraseña es requerida',
                          minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres'
                          }
                        })}
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('confirmPassword', {
                          required: 'Confirma tu nueva contraseña'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Cambiando...' : 'Cambiar'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPassword}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notificaciones</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileForm.watch('preferences.notifications.email')}
                        onChange={(e) => profileForm.setValue('preferences.notifications.email', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileForm.watch('preferences.notifications.sms')}
                        onChange={(e) => profileForm.setValue('preferences.notifications.sms', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">SMS</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileForm.watch('preferences.notifications.push')}
                        onChange={(e) => profileForm.setValue('preferences.notifications.push', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Push</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Privacidad</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileForm.watch('preferences.privacy.showPhone')}
                        onChange={(e) => profileForm.setValue('preferences.privacy.showPhone', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Mostrar teléfono</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileForm.watch('preferences.privacy.showAddress')}
                        onChange={(e) => profileForm.setValue('preferences.privacy.showAddress', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Mostrar dirección</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Usuario:</span>
                  <span className="font-mono text-gray-900">{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="text-gray-900 capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600 font-medium">Activo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="text-gray-900">{user?.subscription?.status || 'Gratuito'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
