const mongoose = require("mongoose");



 

const SubTask = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },

  status: {
    type: Number,
    
    default:0
  },
 
    isdeleted:{
    type:Boolean,
    default:false
  },
  deletedAt:{
    type:Date,
    
  }
  ,

}, { timestamps: true });
const subTask = mongoose.model("subTask", SubTask);

module.exports = subTask;
