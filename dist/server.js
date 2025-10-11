"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT} 🚀`);
});
exports.default = app;
