import { validationResult } from "express-validator";

import Drone from "../models/drone.js";
import { generateErrorMessage } from "../utils/Error.js";
import Battery from "../models/battery.js";

// Get all the drones available
export const getDrones = (req, res, next) => {
  Drone.find()
    .then((droneDetails) => {
      res.status(200).json({
        statusCode: 200,
        message: "Drone details retrieve successful",
        data: {
          drones: droneDetails,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

// Get available drones for loading
export const getAvailableDrones = (req, res, next) => {
  Drone.find({ state: "IDLE", batteryLevel: { $gte: 25 } })
    .then((droneDetails) => {
      res.status(200).json({
        statusCode: 200,
        message: "Drone details retrieve successful",
        data: {
          drones: droneDetails,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

// Get given drones details
export const getDronesDetailsById = (req, res, next) => {
  const id = req.params.id;
  const batteryLevel = req.query.bLevel;

  Drone.findById(id)
    .then((droneDetails) => {
      if (!droneDetails) {
        throw generateErrorMessage("No drone details found", 404, "");
      }
      let drone = droneDetails;

      if (batteryLevel) {
        drone = {
          _id: droneDetails._id,
          serialNumber: droneDetails.serialNumber,
          batteryLevel: droneDetails.batteryLevel,
        };
      }

      res.status(200).json({
        statusCode: 200,
        message: "Drone details retrieve successful",
        data: {
          drone: drone,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

// Register a new drone
export const registerDrone = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw generateErrorMessage("Validation Failed", 422, errors);
  }

  const serialNumber = req.body.serialNumber;
  const model = req.body.model;
  const weightLimit = req.body.weightLimit;
  const batteryLevel = req.body.batteryLevel;
  const state = "IDLE";

  const drone = new Drone({
    serialNumber,
    model,
    weightLimit,
    batteryLevel,
    state,
    medications: {
      items: [],
      totalWeight: 0,
    },
  });

  drone
    .save()
    .then((result) => {
      res.status(201).json({
        statusCode: 201,
        message: "Drone registration successful",
        data: {
          drone: result,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

// Update drone details
export const updateDroneDetails = (req, res, next) => {
  const id = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw generateErrorMessage("Validation Failed", 422, errors);
  }

  const serialNumber = req.body.serialNumber;
  const model = req.body.model;
  const weightLimit = req.body.weightLimit;
  const batteryLevel = req.body.batteryLevel;
  const state = req.body.state;

  Drone.findById(id)
    .then((droneDetails) => {
      if (!droneDetails) {
        throw generateErrorMessage("No drone details found", 404, "");
      }

      droneDetails.serialNumber = serialNumber;
      droneDetails.model = model;
      droneDetails.weightLimit = weightLimit;
      droneDetails.batteryLevel = batteryLevel;
      droneDetails.state = state;

      if (state === "DELIVERED" || state === "RETURNING") {
        droneDetails.medications.items = [];
        droneDetails.medications.totalWeight = 0;
      }

      droneDetails.save().then((result) => {
        res.status(200).json({
          statusCode: 200,
          message: "Drone details updated successful",
          data: {
            drone: result,
          },
        });
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

export const updateBatteryLevelLog = () => {
  Drone.find()
    .then((droneDetails) => {
      droneDetails.forEach((drone) => {
        const batteryLevel = new Battery();
        batteryLevel.batteryLevel = drone.batteryLevel;
        batteryLevel.drone = drone._id;
        return batteryLevel.save();
      });
    })
    .catch((err) => {
      throw generateErrorMessage(err.message, err.statusCode, err);
    });
};
