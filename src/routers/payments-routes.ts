import { createPayments, getPayments } from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentSchemaValid } from "@/schemas/payments-schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken);
paymentsRouter.get("/", getPayments);
paymentsRouter.post("/process", validateBody(paymentSchemaValid), createPayments);

export {
  paymentsRouter
};
