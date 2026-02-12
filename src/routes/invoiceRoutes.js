import express from 'express';


import { createInvoiceFromOrder, getInvoiceByOrderId } from "../controllers/invoiceController.js";
const router = express.Router();
router.post(
  "/invoices/:orderId",
  createInvoiceFromOrder
);

router.get(
  "/invoices/:orderId",
   getInvoiceByOrderId
);
export default router;