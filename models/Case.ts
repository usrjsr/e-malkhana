import mongoose, { Schema, models, model } from "mongoose"

const CaseSchema = new Schema(
  {
    policeStationName: {
      type: String,
      required: true
    },
    investigatingOfficer: {
      name: {
        type: String,
        required: true
      },
      officerId: {
        type: String,
        required: true
      }
    },
    crimeNumber: {
      type: String,
      required: true
    },
    crimeYear: {
      type: Number,
      required: true
    },
    dateOfFIR: {
      type: Date,
      required: true
    },
    dateOfSeizure: {
      type: Date,
      required: true
    },
    actAndLaw: {
      type: String,
      required: true
    },
    sections: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "DISPOSED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
)

const Case = models.Case || model("Case", CaseSchema)

export default Case
