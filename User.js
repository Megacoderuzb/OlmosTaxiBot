const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    username: {
      type: mongoose.SchemaTypes.String,
    },
    phone: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
    is_deleted: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
