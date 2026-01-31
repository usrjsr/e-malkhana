import mongoose, { Schema, models, model } from "mongoose"

const PropertySchema = new Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true
    },
    category: {
      type: String,
      required: true
    },
    belongingTo: {
      type: String,
      enum: ["ACCUSED", "COMPLAINANT", "UNKNOWN"],
      required: true
    },
    nature: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    qrCodeData: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["IN_CUSTODY", "DISPOSED"],
      default: "IN_CUSTODY"
    }
  },
  {
    timestamps: true
  }
)

const Property = models.Property || model("Property", PropertySchema)

export default Property