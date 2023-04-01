import { model, Schema } from "mongoose";

const medSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default model("Medication", medSchema);
