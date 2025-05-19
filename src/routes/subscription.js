import express from "express";
import {
  subscribe,
  confirmSubscription,
  unsubscribe,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/confirm/:token", confirmSubscription);
router.get("/unsubscribe/:token", unsubscribe);

export default router;
