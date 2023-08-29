const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
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
    pnfl: {
      type: mongoose.SchemaTypes.String,
    },
    passport_seria: {
      type: mongoose.SchemaTypes.String,
    },
    self_employment: {
      type: mongoose.SchemaTypes.Boolean,
    },
    is_complated: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    is_deleted: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
  },
  {
    // _id: false,
    // id: true,
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
