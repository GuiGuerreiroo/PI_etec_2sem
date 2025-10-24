import mongoose, {connect} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export class MongoDBResources {
    private static instance: MongoDBResources;
    private connected = false;
    private connecting = false;
    private url: string;

    constructor() {
        const password = process.env.PASSWORD;
        const appName = process.env.APPNAME;
        const dbName = process.env.DBNAME;

        this.url =`mongodb+srv://projetoetec2ul_db_user:${password}@pi-etec-2ul.g6v29i0.mongodb.net/${dbName}?appName=${appName}`;
    }

    public async connectMongoDB(): Promise<void> {
        if (this.connected) {
            return;
        }

        this.connecting = true;
        await mongoose.connect(this.url);

        console.log("🗄️  Connected to MongoDB successfully");
        this.connected = true;
    }

    public async disconnectMongoDB(): Promise<void> {
        if (!this.connected) {
            return;
        }
        await mongoose.connection.close();

        console.log("🔌 MongoDB connection closed.");

        this.connected = false;
    }

    public static getInstance(): MongoDBResources {
        if (!MongoDBResources.instance) {
        MongoDBResources.instance = new MongoDBResources();
        }
        return MongoDBResources.instance;
    }
}