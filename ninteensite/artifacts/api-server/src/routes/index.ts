import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import clientsRouter from "./clients";
import adminRouter from "./admin";
import statsRouter from "./stats";
import storageRouter from "./storage";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(clientsRouter);
router.use(adminRouter);
router.use(statsRouter);
router.use(storageRouter);
router.use(settingsRouter);

export default router;
