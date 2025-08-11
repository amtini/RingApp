import { Link } from 'react-router-dom'
import { Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    producto: [
      { name: 'Características', href: '/#features' },
      { name: 'Precios', href: '/#pricing' },
      { name: 'API', href: '/api-docs' },
      { name: 'Integraciones', href: '/integrations' },
    ],
    empresa: [
      { name: 'Acerca de', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Carreras', href: '/careers' },
      { name: 'Prensa', href: '/press' },
    ],
    soporte: [
      { name: 'Centro de ayuda', href: '/help' },
      { name: 'Documentación', href: '/docs' },
      { name: 'Contacto', href: '/contact' },
      { name: 'Estado del servicio', href: '/status' },
    ],
    legal: [
      { name: 'Privacidad', href: '/privacy' },
      { name: 'Términos', href: '/terms' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Licencias', href: '/licenses' },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-padding mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Cuchu</span>
            </Link>
            <p className="text-secondary-300 mb-4 max-w-md">
              Soluciones de seguridad y comunicación inteligente para edificios y condominios. 
              Tecnología de vanguardia al servicio de tu comunidad.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-secondary-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contacto@cuchu.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h3 className="font-semibold text-white mb-4">Producto</h3>
            <ul className="space-y-2">
              {footerLinks.producto.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-semibold text-white mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {currentYear} Cuchu. Todos los derechos reservados.
          </p>
          
          {/* Social links */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
              >
                <social.icon className="w-5 h-5" />
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
