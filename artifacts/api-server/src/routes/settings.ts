import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import { UpdateSettingsBody, UpdateSettingsResponse, GetSettingsResponse } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth.js";

const SETTING_KEYS = ["siteTitle", "siteSubtitle", "discordLink", "discordButtonText"] as const;

const DEFAULTS: Record<string, string> = {
  siteTitle: "Lenzo Beam Central",
  siteSubtitle: "Your gateway to the most powerful tools in the network",
  discordLink: "YOUR_DISCORD_INVITE_LINK",
  discordButtonText: "Join Discord",
};

async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await db.select().from(settingsTable);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  const map = await getSettingsMap();
  res.json(GetSettingsResponse.parse({
    siteTitle: map["siteTitle"],
    siteSubtitle: map["siteSubtitle"],
    discordLink: map["discordLink"],
    discordButtonText: map["discordButtonText"],
  }));
});

router.put("/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  for (const key of SETTING_KEYS) {
    const value = parsed.data[key];
    if (value !== undefined) {
      await db
        .insert(settingsTable)
        .values({ key, value })
        .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
    }
  }

  const map = await getSettingsMap();
  res.json(UpdateSettingsResponse.parse({
    siteTitle: map["siteTitle"],
    siteSubtitle: map["siteSubtitle"],
    discordLink: map["discordLink"],
    discordButtonText: map["discordButtonText"],
  }));
});

export default router;
