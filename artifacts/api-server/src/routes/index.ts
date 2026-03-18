import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import toolsRouter from "./tools.js";
import settingsRouter from "./settings.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(settingsRouter);
router.use(adminRouter);

export default router;
