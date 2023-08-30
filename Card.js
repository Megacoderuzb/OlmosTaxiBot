const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    tg_id: {
      type: mongoose.SchemaTypes.Number,
      required: true,
    },
    numbers: {
      type: mongoose.SchemaTypes.Number,
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

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
