const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    amount: Number,
    type: {
      type: String,
      enum: ["credit", "debit"]
    },
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);