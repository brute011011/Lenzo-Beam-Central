import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, toolsTable } from "@workspace/db";
import {
  ListToolsResponse,
  CreateToolBody,
  UpdateToolBody,
  UpdateToolParams,
  DeleteToolParams,
  CheckToolStatusParams,
  CheckToolStatusResponse,
  UpdateToolResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth.js";

const router: IRouter = Router();

router.get("/tools", async (_req, res): Promise<void> => {
  const tools = await db.select().from(toolsTable).orderBy(toolsTable.orderNum, toolsTable.id);
  res.json(ListToolsResponse.parse(tools));
});

router.post("/tools", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateToolBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [tool] = await db.insert(toolsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? "",
    link: parsed.data.link,
    orderNum: parsed.data.orderNum ?? 0,
    isActive: parsed.data.isActive ?? true,
  }).returning();

  res.status(201).json(UpdateToolResponse.parse(tool));
});

router.put("/tools/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateToolParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateToolBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Partial<typeof toolsTable.$inferInsert> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.link !== undefined) updateData.link = parsed.data.link;
  if (parsed.data.orderNum !== undefined) updateData.orderNum = parsed.data.orderNum;
  if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;

  const [tool] = await db
    .update(toolsTable)
    .set(updateData)
    .where(eq(toolsTable.id, params.data.id))
    .returning();

  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.json(UpdateToolResponse.parse(tool));
});

router.delete("/tools/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteToolParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tool] = await db
    .delete(toolsTable)
    .where(eq(toolsTable.id, params.data.id))
    .returning();

  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/tools/:id/status", async (req, res): Promise<void> => {
  const params = CheckToolStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.id, params.data.id));
  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  const start = Date.now();
  let online = false;
  let responseTime: number | undefined;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(tool.link, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    responseTime = Date.now() - start;
    online = response.status < 500;
  } catch {
    responseTime = Date.now() - start;
    online = false;
  }

  res.json(CheckToolStatusResponse.parse({
    id: tool.id,
    online,
    responseTime,
    checkedAt: new Date(),
  }));
});

export default router;
