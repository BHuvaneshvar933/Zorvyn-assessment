import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

financialRecordSchema.index({ isDeleted: 1, date: -1 });
financialRecordSchema.index({ isDeleted: 1, type: 1, category: 1, date: -1 });

export default mongoose.model("FinancialRecord", financialRecordSchema);
