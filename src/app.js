import path, { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";

import droneRoute from "./routes/drone.js";
import medicationRoute from "./routes/medication.js";
import loadRoute from "./routes/load.js";
import { updateBatteryLevelLog } from "./controller/drone.js";

const MONGODB_URI = "mongodb://localhost:27017/droneManagement";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configure multer for file upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// For encode json req
app.use(bodyParser.json());

// Register multer
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Statically serve images folder
app.use("/images", express.static(path.join(__dirname, "images")));

// Log battery level every 1 min
cron.schedule("* *1 * * * *", function () {
  updateBatteryLevelLog();
});

//Routes
app.use("/drone", droneRoute);
app.use("/medication", medicationRoute);
app.use("/load", loadRoute);

//Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const [statusCode, message, data] = [
    error.statusCode,
    error.message,
    error.data,
  ];
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
});

// Connect to database
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("CONNECTED");
    // Run the app
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
