import { Router } from "express";
import { body } from "express-validator";

import { addNewMedication, getMedications } from "../controller/medication.js";

const router = Router();

// Get all the medications
router.get("/", getMedications);

// Add a new medication
router.post(
  "/",
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name must be provided")
    .matches("^[A-Za-z0-9_-]*$")
    .withMessage("Only allowed 'A-Z', 'a-z', '0-9', '-' and '_' characters "),
  body("weight")
    .trim()
    .notEmpty()
    .withMessage("Weight must be provided")
    .isInt()
    .withMessage("Weight must be a number")
    .custom((limit) => {
      if (limit <= 0 || limit > 500) {
        throw new Error("Weight must be grater than 0g and less than 500g");
      }
      return true;
    }),
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Code must be provided")
    .matches("^[A-Z0-9_]*$")
    .withMessage("Only allowed 'A-Z', '0-9' and '_' characters "),
  addNewMedication
);

export default router;
