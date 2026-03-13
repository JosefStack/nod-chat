import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

console.log(__dirname);

const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);


// deployment setup
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
};  

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening on port ${PORT}`);
})
