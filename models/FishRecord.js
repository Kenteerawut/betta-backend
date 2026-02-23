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

  imageUrl: String,

  // ✅ NEW ENGINE V21 FIELDS
  fishName: String,       // breed_estimate
  type: String,           // betta_group
  note: String,           // short_reason

  color: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("FishRecord", FishRecordSchema);