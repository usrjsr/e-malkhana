import mongoose, { Schema, models, model } from "mongoose"

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      required: true
    },
    officerId: {
      type: String,
      required: true
    },
    policeStation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const User = models.User || model("User", UserSchema)

export default User
