import mongoose from "mongoose";

const FishRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  species_name: String,
  color_traits: String,
  care_tips: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("FishRecord", FishRecordSchema);
