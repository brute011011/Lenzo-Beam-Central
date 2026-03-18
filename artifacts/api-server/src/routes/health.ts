
import { Router } from "express"; // type IRouter optional
import { HealthCheckResponse } from "@workspace/api-zod";

const router = Router(); // let TS infer type

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
