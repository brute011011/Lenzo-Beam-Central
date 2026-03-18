import { randomBytes } from "crypto";
import { db, adminSessionsTable } from "@workspace/db";
import { eq, lt } from "drizzle-orm";

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db.insert(adminSessionsTable).values({ token, expiresAt });
}

export async function validateToken(token: string): Promise<boolean> {
  await db.delete(adminSessionsTable).where(lt(adminSessionsTable.expiresAt, new Date()));
  const [session] = await db.select().from(adminSessionsTable).where(eq(adminSessionsTable.token, token));
  return !!session;
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token));
}

export function requireAdmin(
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  validateToken(token).then((valid) => {
    if (!valid) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    next();
  }).catch(() => {
    res.status(500).json({ error: "Internal server error" });
  });
}
