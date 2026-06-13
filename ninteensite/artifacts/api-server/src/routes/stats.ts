import { Router, type IRouter } from "express";
import { eq, lt, and, count } from "drizzle-orm";
import { db, productsTable, clientsTable, categoriesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/dashboard", async (_req, res): Promise<void> => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalProductsResult,
    activeProductsResult,
    totalClientsResult,
    activeClientsResult,
    expiringClientsResult,
    totalCategoriesResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(productsTable),
    db.select({ count: count() }).from(productsTable).where(eq(productsTable.status, "active")),
    db.select({ count: count() }).from(clientsTable),
    db.select({ count: count() }).from(clientsTable).where(eq(clientsTable.status, "active")),
    db
      .select({ count: count() })
      .from(clientsTable)
      .where(
        and(
          eq(clientsTable.status, "active"),
          lt(clientsTable.endDate, sevenDaysLater)
        )
      ),
    db.select({ count: count() }).from(categoriesTable),
  ]);

  res.json({
    totalProducts: totalProductsResult[0]?.count ?? 0,
    activeProducts: activeProductsResult[0]?.count ?? 0,
    totalClients: totalClientsResult[0]?.count ?? 0,
    activeClients: activeClientsResult[0]?.count ?? 0,
    expiringClients: expiringClientsResult[0]?.count ?? 0,
    totalCategories: totalCategoriesResult[0]?.count ?? 0,
  });
});

export default router;
