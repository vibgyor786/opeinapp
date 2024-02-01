const mongoose = require("mongoose");
const { set, Schema, model, connect, connection, plugin } = require('mongoose');



const userSchema = new mongoose.Schema({
  
  phoneNumber: {
    type: String,
    required: true,
  },
  
  priority: {
    type: Number,
    default: -1,
  },
  isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

});



const user = mongoose.model("user", userSchema);

module.exports = user;
