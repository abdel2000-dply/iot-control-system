import e from 'express';
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'iot_system';

    const url = `mongodb://${host}:${port}`;

    this.connected = false;
    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(database);
        this.connected = true;
      })
      .catch((error) => {
        console.log('MongoDB connection error:', error);
      });
  }

  isAlive() {
    return this.connected;
  }

}

const dbClient = new DBClient();
export default dbClient;
