import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const authRouter = express.Router();

authRouter.use(arcjetProtection)

authRouter.post("/signup", signup);
authRouter.post("/login", arcjetProtection,login);
authRouter.post("/logout", logout);

authRouter.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route" })
})

authRouter.put("/update-profile", protectRoute, updateProfile);

authRouter.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default authRouter;