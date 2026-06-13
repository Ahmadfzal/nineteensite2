import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatProduct(product: typeof productsTable.$inferSelect, categoryName?: string | null) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    discount: product.discount ?? null,
    description: product.description,
    categoryId: product.categoryId,
    categoryName: categoryName ?? null,
    images: product.images ?? [],
    features: product.features ?? [],
    status: product.status,
    whatsappNumber: product.whatsappNumber,
    createdAt: product.createdAt.toISOString(),
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, category, status } = parsed.data;

  const conditions: SQL[] = [];
  if (search) {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }
  if (status) {
    conditions.push(eq(productsTable.status, status));
  }

  const rows = await db
    .select({
      product: productsTable,
      categoryName: categoriesTable.name,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(productsTable.createdAt);

  let results = rows.map((r) => formatProduct(r.product, r.categoryName));

  if (category) {
    results = results.filter((p) =>
      p.categoryName?.toLowerCase() === category.toLowerCase()
    );
  }

  res.json(results);
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [product] = await db
    .insert(productsTable)
    .values({
      name: data.name,
      price: String(data.price),
      discount: data.discount ?? null,
      description: data.description,
      categoryId: data.categoryId ?? null,
      images: data.images ?? [],
      features: data.features ?? [],
      status: data.status ?? "active",
      whatsappNumber: data.whatsappNumber,
    })
    .returning();

  let categoryName: string | null = null;
  if (product.categoryId) {
    const [cat] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, product.categoryId));
    categoryName = cat?.name ?? null;
  }

  res.status(201).json(formatProduct(product, categoryName));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select({
      product: productsTable,
      categoryName: categoriesTable.name,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (!rows[0]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(formatProduct(rows[0].product, rows[0].categoryName));
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = String(data.price);
  if ("discount" in data) updateData.discount = data.discount ?? null;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.images !== undefined) updateData.images = data.images;
  if (data.features !== undefined) updateData.features = data.features;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber;

  const [product] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  let categoryName: string | null = null;
  if (product.categoryId) {
    const [cat] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, product.categoryId));
    categoryName = cat?.name ?? null;
  }

  res.json(formatProduct(product, categoryName));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
