import { validationResult } from "express-validator";

import Drone from "../models/drone.js";

// Get all the drones available
export const getDrones = (req, res, next) => {
  // TODO write logic
  res.status(200).json({
    data: {
      drones: {
        id: {
          id: "id",
          serialNumber: "serialNumber",
          model: "model",
          weightLimit: "weightLimit",
          batteryLevel: "batteryLevel",
          state: "state",
        },
        id2: {
          id: "id",
          serialNumber: "serialNumber",
          model: "model",
          weightLimit: "weightLimit",
          batteryLevel: "batteryLevel",
          state: "state",
        },
      },
    },
  });
};

// Get available drones for loading
export const getAvailableDrones = (req, res, next) => {
  // TODO write logic
  res.status(200).json({
    data: {
      drones: {
        id: {
          id: "id",
          serialNumber: "serialNumber",
          model: "model",
          weightLimit: "weightLimit",
          batteryLevel: "batteryLevel",
          state: "state",
        },
        id2: {
          id: "id",
          serialNumber: "serialNumber",
          model: "model",
          weightLimit: "weightLimit",
          batteryLevel: "batteryLevel",
          state: "state",
        },
      },
    },
  });
};

// Get given drones battery level
export const getDronesBatteryLevel = (req, res, next) => {
  // TODO write logic
  res.status(200).json({
    data: {
      drone: {
        id: "id",
        serialNumber: "serialNumber",
        batteryLevel: "100%",
      },
    },
  });
};

// Register a new drone
export const registerDrone = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      statusCode: 422,
      message: "Validation Failed",
      errors: errors,
    });
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
      console.log(err);
    });
};
