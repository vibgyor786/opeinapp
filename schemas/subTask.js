const mongoose = require("mongoose");


  // use soft delete plugin
 

const SubTask = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },

  status: {
    type: Number,
    
    default:0
  },
 
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at',deletedAt:'deleted_at' }
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
