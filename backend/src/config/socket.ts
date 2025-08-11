import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export const setupSocketIO = (io: Server) => {
  // Middleware para autenticación
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      
      if (!token) {
        return next(new Error('Token de autenticación requerido'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      socket.userId = decoded.userId;
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 Usuario conectado: ${socket.userId}`);
    
    // Unirse a sala personal del usuario
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      socket.join('general');
    }

    // Manejar notificaciones en tiempo real
    socket.on('join-notification-room', (roomId: string) => {
      socket.join(`notification:${roomId}`);
      console.log(`📱 Usuario ${socket.userId} se unió a la sala de notificación ${roomId}`);
    });

    socket.on('leave-notification-room', (roomId: string) => {
      socket.leave(`notification:${roomId}`);
      console.log(`📱 Usuario ${socket.userId} salió de la sala de notificación ${roomId}`);
    });

    // Manejar mensajes de chat
    socket.on('send-message', (data) => {
      const { roomId, message, type } = data;
      
      // Emitir mensaje a la sala específica
      io.to(`chat:${roomId}`).emit('new-message', {
        userId: socket.userId,
        message,
        type,
        timestamp: new Date(),
        user: {
          id: socket.userId,
          firstName: socket.user?.firstName,
          lastName: socket.user?.lastName,
          avatar: socket.user?.avatar
        }
      });
    });

    // Manejar estado de escritura
    socket.on('typing-start', (roomId: string) => {
      socket.to(`chat:${roomId}`).emit('user-typing', {
        userId: socket.userId,
        firstName: socket.user?.firstName
      });
    });

    socket.on('typing-stop', (roomId: string) => {
      socket.to(`chat:${roomId}`).emit('user-stop-typing', {
        userId: socket.userId
      });
    });

    // Manejar estado de presencia
    socket.on('set-presence', (status: 'online' | 'away' | 'offline') => {
      if (socket.userId) {
        socket.to(`user:${socket.userId}`).emit('presence-update', {
          userId: socket.userId,
          status,
          lastSeen: new Date()
        });
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`🔌 Usuario desconectado: ${socket.userId}`);
      
      // Notificar a otros usuarios sobre la desconexión
      if (socket.userId) {
        socket.to(`user:${socket.userId}`).emit('presence-update', {
          userId: socket.userId,
          status: 'offline',
          lastSeen: new Date()
        });
      }
    });
  });

  return io;
};

// Funciones para emitir notificaciones
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToAll = (io: Server, event: string, data: any) => {
  io.emit(event, data);
};

export const emitToRoom = (io: Server, roomId: string, event: string, data: any) => {
  io.to(roomId).emit(event, data);
};
