import { validationResult } from "express-validator";

import Drone from "../models/drone.js";
import Medication from "../models/medication.js";
import { generateErrorMessage } from "../utils/Error.js";

export const getMedicationInDrone = (req, res, next) => {
  const id = req.params.id;

  Drone.findById(id)
    .populate("medications.items.medicationId")
    .then((droneDetails) => {
      if (!droneDetails) {
        throw generateErrorMessage("No drone details found", 404, "");
      }

      res.status(200).json({
        statusCode: 200,
        message: "Drone details retrieve successful",
        data: {
          drone: droneDetails,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

export const loadMedicationToDrone = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw generateErrorMessage("Validation Failed", 422, errors);
  }

  const drone_id = req.params.id;

  const medication_id = req.body._id;
  const medication_qty = parseInt(req.body.qty);

  Drone.findById(drone_id)
    .populate("medications.items.medicationId")
    .then((droneDetails) => {
      if (!droneDetails) {
        throw generateErrorMessage("No drone details found", 404, "");
      }
      if (droneDetails.batteryLevel < 25) {
        throw generateErrorMessage(
          "This drone not allowed for loading",
          422,
          ""
        );
      }
      return addMedicationToDrone(droneDetails, medication_id, medication_qty);
    })
    .then((drone) => {
      if (drone.weightLimit < drone.medications.totalWeight) {
        throw generateErrorMessage(
          "Can't add weight over the weight limit of the drone",
          422,
          ""
        );
      }

      drone.save().then((result) => {
        res.status(200).json({
          statusCode: 200,
          message: "Medication details updated successful",
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

const addMedicationToDrone = (droneDetails, medication_id, medication_qty) => {
  const droneMedicationIndex = droneDetails.medications.items.findIndex((m) => {
    return m.medicationId._id.toString() === medication_id.toString();
  });

  if (droneMedicationIndex < 0) {
    return Medication.findById(medication_id).then((medication) => {
      if (!medication) {
        throw generateErrorMessage("No medication details found", 404, "");
      }

      droneDetails.medications.items.push({
        medicationId: medication_id,
        quantity: medication_qty,
      });
      droneDetails.medications.totalWeight +=
        medication.weight * medication_qty;
      return droneDetails;
    });
  } else {
    droneDetails.medications.items[droneMedicationIndex].quantity +=
      medication_qty;
    droneDetails.medications.totalWeight +=
      droneDetails.medications.items[droneMedicationIndex].medicationId.weight *
      medication_qty;
    return droneDetails;
  }
};
