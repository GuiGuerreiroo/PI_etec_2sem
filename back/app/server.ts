import { routes } from "./routes/routes";
import { errorHandlerMiddleware } from "./shared/middleware/error_middleware";
import { MongoDBResources } from "./shared/repositories/database/mongo/mongo_datasource";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Env } from "./env";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

console.log("🚀 Server is starting...");
console.log(`📡 Listening on port ${PORT}`);

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

routes(app);

app.use(errorHandlerMiddleware);


async function startServer() {
  const mongoDB = MongoDBResources.getInstance();
  try {

    if (Env.STAGE === "dev"){
      await mongoDB.connectMongoDB();

    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT} 🚀`);
    });
    

    const shuttingDownConnExpress = async () => {

      console.log("\n🛑 Shutting down safetly...");

      if (Env.STAGE === "dev"){
        await mongoDB.disconnectMongoDB();
      }

      server.close(() => {
        console.log("👋 Express server closed. Bye!");
        process.exit(0);
      });
    };

    process.on("SIGINT", shuttingDownConnExpress);
    process.on("SIGTERM", shuttingDownConnExpress);

  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

startServer();

export default app;
