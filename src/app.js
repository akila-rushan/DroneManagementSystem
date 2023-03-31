import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import droneRoute from "./routes/drone.js";

const MONGODB_URI = "mongodb://localhost:27017/droneManagement";

const app = express();

// For encode json req
app.use(bodyParser.json());

//Routes
app.use("/drone", droneRoute);

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
