import mongoose, { Schema, models, model } from "mongoose"

const CustodyLogSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: true
    },
    remarks: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: false
  }
)

const CustodyLog = models.CustodyLog || model("CustodyLog", CustodyLogSchema)

export default CustodyLog
