import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// Middleware para verificar token JWT
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
};

// Middleware para verificar si el usuario es admin
export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authenticateToken(req, res, () => {});
    
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
  } catch (error) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
};

// Middleware para verificar si el usuario es premium
export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authenticateToken(req, res, () => {});
    
    if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Premium access required' });
      return;
    }
  } catch (error) {
    res.status(403).json({ message: 'Premium access required' });
    return;
  }
};

// Middleware para verificar si el usuario es el propietario o admin
export const requireOwnerOrAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authenticateToken(req, res, () => {});
    
    const userId = req.params.id || req.body.userId;
    
    if (req.user && (req.user._id.toString() === userId || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
};

// Middleware para verificar si el usuario está autenticado (opcional)
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await User.findById(decoded.userId);
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    next();
    return;
  }
};
