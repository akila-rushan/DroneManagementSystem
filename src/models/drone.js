import { model, Schema } from "mongoose";

const droneSchema = new Schema({
  serialNumber: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  weightLimit: {
    type: Number,
    required: true,
  },
  batteryLevel: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

export default model("Drone", droneSchema);
