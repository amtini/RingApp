# Cuchu - Virtual Portero

A modern web application for virtual doorman services, inspired by Bellify and Portero Virtual. Built with React, Node.js, TypeScript, and real-time notifications.

## 🚀 Features

- **Real-time Notifications**: WebSocket-based instant notifications
- **User Authentication**: JWT-based auth with Google OAuth support
- **Subscription Management**: Stripe and MercadoPago integration
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion
- **Real-time Communication**: Socket.IO for live updates
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- Stripe + MercadoPago
- Nodemailer

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Zustand (State Management)
- Framer Motion
- React Query

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd cuchu
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Environment Setup
```bash
# Backend
cd backend
cp env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start development servers
```bash
# From root directory
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cuchu_portero
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=your-stripe-key
MERCADOPAGO_ACCESS_TOKEN=your-mercadopago-token
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📁 Project Structure

```
cuchu/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database, Socket.IO config
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # State management
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── package.json             # Root package.json
└── README.md
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## 🏗️ Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription

## 🔒 Security Features

- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection

## 🚀 Deployment

### Backend
- Set `NODE_ENV=production`
- Configure production MongoDB
- Set up environment variables
- Use PM2 or similar process manager

### Frontend
- Build with `npm run build`
- Deploy to Vercel, Netlify, or similar
- Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic authentication system
- Real-time notifications
- Subscription management
- Modern UI/UX
