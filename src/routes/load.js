import { Router } from "express";
import { body } from "express-validator";

import {
  getMedicationInDrone,
  loadMedicationToDrone,
} from "../controller/load.js";

const router = Router();

router.get("/details/:id", getMedicationInDrone);

router.put(
  "/:id",
  body("_id")
    .trim()
    .notEmpty()
    .withMessage("Medication details must be provided"),
  body("qty")
    .trim()
    .notEmpty()
    .withMessage("Medication quantity must be provided")
    .isInt()
    .withMessage("Medication quantity must be a number"),
  loadMedicationToDrone
);

export default router;
