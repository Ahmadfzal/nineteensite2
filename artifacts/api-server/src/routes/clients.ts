import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, clientsTable } from "@workspace/db";
import {
  CreateClientBody,
  GetClientParams,
  LookupClientByWebsiteIdParams,
  UpdateClientParams,
  UpdateClientBody,
  DeleteClientParams,
  ExtendClientParams,
  ToggleClientStatusParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/require-admin";

const router: IRouter = Router();

function daysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatClient(client: typeof clientsTable.$inferSelect) {
  const endDate = new Date(client.endDate);
  const now = new Date();
  // Auto-compute status based on expiry
  const effectiveStatus = endDate < now ? "inactive" : client.status;
  return {
    id: client.id,
    websiteName: client.websiteName,
    websiteId: client.websiteId,
    url: client.url,
    status: effectiveStatus,
    startDate: client.startDate.toISOString(),
    endDate: endDate.toISOString(),
    daysRemaining: daysRemaining(endDate),
  };
}

router.get("/clients", requireAdmin, async (_req, res): Promise<void> => {
  const clients = await db
    .select()
    .from(clientsTable)
    .orderBy(clientsTable.createdAt);

  // Auto-deactivate expired clients
  for (const client of clients) {
    if (new Date(client.endDate) < new Date() && client.status === "active") {
      await db
        .update(clientsTable)
        .set({ status: "inactive" })
        .where(eq(clientsTable.id, client.id));
      client.status = "inactive";
    }
  }

  res.json(clients.map(formatClient));
});

router.post("/clients", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  const [client] = await db
    .insert(clientsTable)
    .values({
      websiteName: data.websiteName,
      websiteId: data.websiteId,
      url: data.url,
      status: data.status ?? "active",
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    })
    .returning();

  res.status(201).json(formatClient(client));
});

router.get(
  "/clients/lookup/:websiteId",
  async (req, res): Promise<void> => {
    const params = LookupClientByWebsiteIdParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [client] = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.websiteId, params.data.websiteId));

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json(formatClient(client));
  },
);

router.get("/clients/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = GetClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [client] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, params.data.id));

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(formatClient(client));
});

router.patch("/clients/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};
  if (data.websiteName !== undefined) updateData.websiteName = data.websiteName;
  if (data.websiteId !== undefined) updateData.websiteId = data.websiteId;
  if (data.url !== undefined) updateData.url = data.url;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);

  const [client] = await db
    .update(clientsTable)
    .set(updateData)
    .where(eq(clientsTable.id, params.data.id))
    .returning();

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(formatClient(client));
});

router.delete("/clients/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [client] = await db
    .delete(clientsTable)
    .where(eq(clientsTable.id, params.data.id))
    .returning();

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/clients/:id/extend", requireAdmin, async (req, res): Promise<void> => {
  const params = ExtendClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  // Extend from end date or today (whichever is later)
  const baseDate = new Date(existing.endDate) > new Date() ? new Date(existing.endDate) : new Date();
  const newEndDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [client] = await db
    .update(clientsTable)
    .set({ endDate: newEndDate, status: "active" })
    .where(eq(clientsTable.id, params.data.id))
    .returning();

  res.json(formatClient(client));
});

router.post("/clients/:id/toggle-status", requireAdmin, async (req, res): Promise<void> => {
  const params = ToggleClientStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const newStatus = existing.status === "active" ? "inactive" : "active";

  const [client] = await db
    .update(clientsTable)
    .set({ status: newStatus })
    .where(eq(clientsTable.id, params.data.id))
    .returning();

  res.json(formatClient(client));
});

export default router;
