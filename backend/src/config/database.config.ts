// db.ts
import mongoose, { Connection } from 'mongoose';
import { Env } from './env.config';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;
  private connection!: Connection;

  private constructor() {} // prevent external instantiation

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.connection && this.connection.readyState === 1) {
      logger.info('MongoDB: already connected');
      return;
    }

    try {
      await mongoose.connect(Env.MONGO_URI);
      this.connection = mongoose.connection;
      logger.info('MongoDB: connected');
    } catch (error) {
      logger.error('MongoDB: connection error', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      logger.info('MongoDB: no active connection to close');
      return;
    }

    try {
      await mongoose.disconnect();
      logger.info('MongoDB: disconnected');
    } catch (error) {
      logger.error('MongoDB: disconnection error', error);
      process.exit(1);
    }
  }

  public getConnection(): Connection {
    if (!this.connection) {
      throw new Error('MongoDB: not connected yet. Call connect() first.');
    }
    return this.connection;
  }
}

export const database = Database.getInstance();
