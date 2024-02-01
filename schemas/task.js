const mongoose = require("mongoose");

const task = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,

      default: "TODO",
    },
    priority: {
      type: Number,
      required: true,
    },
   
    isdeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const subTask = mongoose.model("task", task);
module.exports = subTask;
