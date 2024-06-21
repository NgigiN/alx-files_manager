import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

class DBClient {
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;
    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect().catch((error) => {
      console.error('Failed to connect to the database:', error);
    });
  }

  isAlive() {
    return this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    try {
      return await this.client.db().collection('users').countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return 0; // Return a default value or handle the error as needed
    }
  }

  async nbFiles() {
    try {
      return await this.client.db().collection('files').countDocuments();
    } catch (error) {
      console.error('Error counting files:', error);
      return 0; // Return a default value or handle the error as needed
    }
  }

  async usersCollection() {
    try {
      return this.client.db().collection('users');
    } catch (error) {
      console.error('Error accessing users collection:', error);
      throw error; // or handle the error as needed
    }
  }

  async filesCollection() {
    try {
      return this.client.db().collection('files');
    } catch (error) {
      console.error('Error accessing files collection:', error);
      throw error;
    }
  }
}

export const dbClient = new DBClient();
export default dbClient;
