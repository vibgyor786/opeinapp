const express = require("express");
const app = express();
const router = express.Router();
const { jwtDecode } = require('jwt-decode');
const user=require('../schemas/userSchema')
const task=require('../schemas/task')
const subtask=require('../schemas/subTask')


// <-----------------------delete current task------------------------->
router.delete('/task',async(req,res)=>{
    
    // <-----------------------checking id is present in the body or not------------------------->
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide id for deletion"
        })
        return;
    }

    try{

        
        // <-----------------------soft deleting the task------------------------->
        var newvalues = await { $set: { isdeleted:true,deletedAt:new Date()} };
        const data=await  task.updateOne({_id:req.body.id}, newvalues)
        
        // <-----------------------getting the current task id------------------------->
        const subtaskdata=await task.findById(req.body.id)
        const taskId=subtaskdata._id

           // <-----------------------for that unique id delete the all the subtask------------------------->
        const datasub=await  subtask.updateMany({taskId:taskId}, newvalues)
        


        res.status(200).send("sucessfully deleted")

    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }
})



    // <-----------------------soft deleting the  sub task------------------------->
router.delete('/subtask',async(req,res)=>{

        // <-----------------------checking id present in the body------------------------->
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide id for deletion"
        })
        return;
    }

    try{
        
        // <-----------------------soft deleting the values by updating it------------------------->
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