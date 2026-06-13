import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const DEFAULTS = {
  hero_badge: "Jasa Sewa Website Profesional",
  hero_title: "Website Impian Anda",
  hero_subtitle: "Tanpa Ribet",
  hero_description:
    "Sewa website profesional berkualitas tinggi dengan harga terjangkau. Tersedia berbagai pilihan template untuk bisnis Anda.",
};

async function getSettingValue(key: string): Promise<string> {
  const rows = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, key));
  return rows[0]?.value ?? DEFAULTS[key as keyof typeof DEFAULTS] ?? "";
}

router.get("/settings", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(settingsTable);
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    res.json({
      heroBadge: map["hero_badge"] ?? DEFAULTS.hero_badge,
      heroTitle: map["hero_title"] ?? DEFAULTS.hero_title,
      heroSubtitle: map["hero_subtitle"] ?? DEFAULTS.hero_subtitle,
      heroDescription: map["hero_description"] ?? DEFAULTS.hero_description,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching settings");
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req: Request, res: Response) => {
  if (!req.session.adminId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { heroBadge, heroTitle, heroSubtitle, heroDescription } = req.body as Record<string, unknown>;

  const updates: Array<{ key: string; value: string }> = [];
  if (typeof heroBadge === "string") updates.push({ key: "hero_badge", value: heroBadge });
  if (typeof heroTitle === "string") updates.push({ key: "hero_title", value: heroTitle });
  if (typeof heroSubtitle === "string") updates.push({ key: "hero_subtitle", value: heroSubtitle });
  if (typeof heroDescription === "string") updates.push({ key: "hero_description", value: heroDescription });

  try {
    for (const { key, value } of updates) {
      await db
        .insert(settingsTable)
        .values({ key, value })
        .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
    }

    const rows = await db.select().from(settingsTable);
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    res.json({
      heroBadge: map["hero_badge"] ?? DEFAULTS.hero_badge,
      heroTitle: map["hero_title"] ?? DEFAULTS.hero_title,
      heroSubtitle: map["hero_subtitle"] ?? DEFAULTS.hero_subtitle,
      heroDescription: map["hero_description"] ?? DEFAULTS.hero_description,
    });
  } catch (err) {
    req.log.error({ err }, "Error updating settings");
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
