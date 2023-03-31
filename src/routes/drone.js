import { Router } from "express";
import { body } from "express-validator";
import { droneModel } from "../constants/drone.js";

import {
  getAvailableDrones,
  getDrones,
  getDronesBatteryLevel,
  registerDrone,
} from "../controller/drone.js";

const router = Router();

// Get all the drones
router.get("/", getDrones);

// Get drones available for loading
router.get("/available", getAvailableDrones);

// Get drone battery level by given id
router.get("/:id", getDronesBatteryLevel);

// Register a new drone
router.post(
  "/",

  body("serialNumber")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Serial number must be provided and must be less than 100 characters"
    ),
  body("model").trim().isIn(droneModel).withMessage("Invalid drone model"),
  body("weightLimit")
    .isInt()
    .withMessage("Weight limit must be a number and must be provided")
    .custom((limit) => {
      if (limit <= 0 || limit > 500) {
        throw new Error(
          "Weight limit must be grater than 0g and less than 500g"
        );
      }
      return true;
    }),
  body("batteryLevel")
    .isInt()
    .withMessage("Battery level must be an integer and must be provided")
    .custom((limit) => {
      if (limit < 0 || limit > 100) {
        throw new Error(
          "Weight limit must be grater than 0g and less than 500g"
        );
      }
      return true;
    }),
  registerDrone
);

export default router;
