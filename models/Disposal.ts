import mongoose, { Schema, models, model } from "mongoose"

const DisposalSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      unique: true
    },
    disposalType: {
      type: String,
      enum: ["RETURNED", "DESTROYED", "AUCTIONED", "COURT_CUSTODY"],
      required: true
    },
    courtOrderReference: {
      type: String,
      required: true
    },
    disposalDate: {
      type: Date,
      required: true
    },
    remarks: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Disposal = models.Disposal || model("Disposal", DisposalSchema)

export default Disposal
