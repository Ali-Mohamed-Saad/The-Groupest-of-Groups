import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import aiRoute from './routes/aiRoute.js';

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.use('/ai', aiRoute);

app.get("/", (req, res) => {
    res.json({ message: "AI Sprint API Running" });
});

export default app;