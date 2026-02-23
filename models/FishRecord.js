import mongoose from "mongoose";

const FishRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  fishName: String,
  type: String,
  note: String,

  imageName: {
    type: String,
    required: true,
  },

  imageUrl: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("FishRecord", FishRecordSchema);