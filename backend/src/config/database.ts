import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cuchu_portero';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB conectado exitosamente');
    
    // Configuración adicional para producción
    if (process.env.NODE_ENV === 'production') {
      mongoose.set('debug', false);
    } else {
      mongoose.set('debug', true);
    }
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB desconectado exitosamente');
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error);
  }
};

export { connectDB, disconnectDB };
