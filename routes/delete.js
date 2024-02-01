const express = require("express");
const app = express();
const router = express.Router();
const { jwtDecode } = require('jwt-decode');
const user=require('../schemas/userSchema')
const task=require('../schemas/task')
const subtask=require('../schemas/subTask')

router.delete('/task',async(req,res)=>{
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide id for deletion"
        })
        return;
    }

    try{
        var newvalues = await { $set: { isdeleted:true,deletedAt:new Date()} };
        const data=await  task.updateOne({_id:req.body.id}, newvalues)
        
        const subtaskdata=await task.findById(req.body.id)
        const taskId=subtaskdata._id

       
        const datasub=await  subtask.updateMany({taskId:taskId}, newvalues)
        


        res.status(200).send("sucessfully deleted")
    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }
})
router.delete('/subtask',async(req,res)=>{
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide id for deletion"
        })
        return;
    }

    try{
        var newvalues = await { $set: { isdeleted:true,deletedAt:new Date()} };
        const data=await  subtask.updateOne({_id:req.body.id}, newvalues)
        
        res.status(200).send("sucessfully deleted")
    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }
})








module.exports = router;