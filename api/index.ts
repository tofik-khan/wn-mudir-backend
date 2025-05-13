require('dotenv').config()
import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;