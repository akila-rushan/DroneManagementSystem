import { Router } from "express";
import { body } from "express-validator";
import { droneModel, droneState } from "../constants/drone.js";

import {
  getAvailableDrones,
  getDrones,
  getDronesDetailsById,
  registerDrone,
  updateDroneDetails,
} from "../controller/drone.js";

const router = Router();

// Get all the drones
router.get("/", getDrones);

// Get drones available for loading
router.get("/available", getAvailableDrones);

// Get drone details by given id
router.get("/:id", getDronesDetailsById);

// Register a new drone
router.post(
  "/",

  body("serialNumber")
    .trim()
    .notEmpty()
    .withMessage("Serial number must be provided")
    .isLength({ min: 1, max: 100 })
    .withMessage("Serial number must be less than 100 characters"),
  body("model").trim().isIn(droneModel).withMessage("Invalid drone model"),
  body("weightLimit")
    .notEmpty()
    .withMessage("Weight limit must be provided")
    .isInt()
    .withMessage("Weight limit must be a number")
    .custom((limit) => {
      if (limit <= 0 || limit > 500) {
        throw new Error(
          "Weight limit must be grater than 0g and less than 500g"
        );
      }
      return true;
    }),
  body("batteryLevel")
    .notEmpty()
    .withMessage("Battery level must be provided")
    .isInt()
    .withMessage("Battery level must be an integer")
    .custom((limit) => {
      if (limit < 0 || limit > 100) {
        throw new Error(
          "Battery level must be grater than 0 and less than 100"
        );
      }
      return true;
    }),
  registerDrone
);

// Update drone details by id
router.put(
  "/:id",
  body("serialNumber")
    .trim()
    .notEmpty()
    .withMessage("Serial number must be provided")
    .isLength({ min: 1, max: 100 })
    .withMessage("Serial number must be less than 100 characters"),
  body("model").trim().isIn(droneModel).withMessage("Invalid drone model"),
  body("weightLimit")
    .notEmpty()
    .withMessage("Weight limit must be provided")
    .isInt()
    .withMessage("Weight limit must be a number")
    .custom((limit) => {
      if (limit <= 0 || limit > 500) {
        throw new Error(
          "Weight limit must be grater than 0g and less than 500g"
        );
      }
      return true;
    }),
  body("batteryLevel")
    .notEmpty()
    .withMessage("Battery level must be provided")
    .isInt()
    .withMessage("Battery level must be an integer")
    .custom((limit) => {
      if (limit < 0 || limit > 100) {
        throw new Error(
          "Battery level must be grater than 0 and less than 100"
        );
      }
      return true;
    }),
  body("state").trim().isIn(droneState).withMessage("Invalid drone state"),
  updateDroneDetails
);

export default router;
