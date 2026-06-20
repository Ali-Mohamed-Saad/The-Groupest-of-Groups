import dotenv from "dotenv";

dotenv.config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "AI Sprint API Running" });
});

module.exports = app;