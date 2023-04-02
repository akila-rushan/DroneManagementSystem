import { model, Schema } from "mongoose";

const batterySchema = new Schema(
  {
    batteryLevel: {
      type: Number,
      required: true,
    },
    drone: {
      type: Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Battery", batterySchema);
