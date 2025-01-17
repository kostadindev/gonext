import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { matchesRouter } from "./routes/matches/matches.router";
import summonersRouter from "./routes/summoners/summoners.router";
import championsRouter from "./routes/champions/champions.router";
import sessionRouter from "./routes/sessions/sessions.router";
import authRouter from "./routes/auth/auth.routes";
import chatbotRouter from "./routes/chatbot/chatbot.router";
import tipsRouter from "./routes/tips/tips.router";

// Initialize environment variables
dotenv.config();

const app: Express = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan("dev"));

app.use(authRouter);
app.use(matchesRouter);
app.use(summonersRouter);
app.use(championsRouter);
app.use(sessionRouter);
app.use(chatbotRouter);
app.use(tipsRouter);

export default app;
