import { validationResult } from "express-validator";

import Medication from "../models/medication.js";
import { generateErrorMessage } from "../utils/Error.js";

// Get all the medication available
export const getMedications = (req, res, next) => {
  Medication.find()
    .then((medicationDetails) => {
      res.status(200).json({
        statusCode: 200,
        message: "Medication details retrieve successful",
        data: {
          medications: medicationDetails,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};

// Add new medication
export const addNewMedication = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw generateErrorMessage("Validation Failed", 422, errors);
  }

  if (!req.file) {
    throw generateErrorMessage("Image must be provided", 422, errors);
  }

  const name = req.body.name;
  const weight = req.body.weight;
  const code = req.body.code;
  const image = req.file.path.replace("\\", "/");

  const medication = new Medication({
    name,
    weight,
    code,
    image,
  });

  medication
    .save()
    .then((result) => {
      res.status(201).json({
        statusCode: 201,
        message: "New medication added successful",
        data: {
          medication: result,
        },
      });
    })
    .catch((err) => {
      next(generateErrorMessage(err.message, err.statusCode, err));
    });
};
