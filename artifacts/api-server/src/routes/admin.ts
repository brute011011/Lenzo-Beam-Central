import { Router, type IRouter } from "express";
import { AdminLoginBody, AdminLoginResponse } from "@workspace/api-zod";
import { createSession, deleteSession, generateToken, requireAdmin } from "../lib/auth.js";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const adminPassword = process.env["ADMIN_PASSWORD"] || "admin123";
  if (parsed.data.password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = generateToken();
  await createSession(token);
  res.json(AdminLoginResponse.parse({ token }));
});

router.post("/admin/logout", requireAdmin, async (req, res): Promise<void> => {
  const token = req.headers.authorization!.slice(7);
  await deleteSession(token);
  res.sendStatus(204);
});

export default router;
