const express = require("express");
const app = express();
const router = express.Router();
const { jwtDecode } = require('jwt-decode');
const user=require('../schemas/userSchema')
const task=require('../schemas/task')
const subtask=require('../schemas/subTask')

router.post("/task",async(req,res)=>{
    if(req.body.token==null || req.body.title==null || req.body.dueDate==null  || req.body.description==null ){
        res.status(200).send({
            Error:"Please provide all details : token,title,due date, description"
        })
    }
    const sampleTask=req.body.token;
    const decodedid = jwtDecode(sampleTask);

    const day=new Date(req.body.dueDate).getDate()
    const month=new Date(req.body.dueDate).getMonth()
    const year=new Date(req.body.dueDate).getFullYear()
    const today=new Date()

    const datetoday=today.getDate()
    const monthtoday=today.getMonth()
    const yearday=today.getFullYear()
    let priority=0;

    if(yearday<year){
        priority=3
    }else if(monthtoday<month){
        priority=3
    }else {
        if(day-datetoday==0){
            priority=0
        }else if(day-datetoday==1){
            priority=1
        }else if(day-datetoday==2){
            priority=2
        }else{
            priority=3
        }
    }
    
    try{
        const newtask=new task({
            userId:decodedid.id,
            title:req.body.title,
            dueDate:new Date(req.body.dueDate),
            description:req.body.description,
            priority
        })

        const data= await newtask.save();
        res.status(200).send(data)
    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }
})

router.post("/subtask",async(req,res)=>{
    if(req.body.taskId==null){
        res.status(200).send({
            Error:"provide taskID"
        })
    }
    try{
        const data =new subtask(req.body)
        const save=await data.save()
        res.status(200).send(save)

    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }

})

router.post("/updatetaskdate",async(req,res)=>{

    if(req.body.dueDate==null){
        res.status(200).send({
            Error:"provide due date"
        })
    }
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide user id"
        })
    }
    const day=new Date(req.body.dueDate).getDate()
    const month=new Date(req.body.dueDate).getMonth()
    const year=new Date(req.body.dueDate).getFullYear()
    const today=new Date()

    const datetoday=today.getDate()
    const monthtoday=today.getMonth()
    const yearday=today.getFullYear()
    let priority=0;

    if(yearday<year){
        priority=3
    }else if(monthtoday<month){
        priority=3
    }else {
        if(day-datetoday==0){
            priority=0
        }else if(day-datetoday==1){
            priority=1
        }else if(day-datetoday==2){
            priority=2
        }else{
            priority=3
        }
    }

    try{
        var newvalues = { $set: { dueDate: req.body.dueDate,priority} };
      const data=await  task.updateOne({_id:req.body.id}, newvalues)
      res.status(200).send(data)
    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }
})

router.post("/updatetaskstatus",async(req,res)=>{
    if(req.body.status==null){
        res.status(200).send({
            Error:"provide status"
        })
    }
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide user id"
        })
    }
    

    try{
        
        if(req.body.status=="DONE"){
            var newsub =  { $set: { status:1} };
            const data=await  subtask.updateMany({taskId:req.body.id}, newsub)
        }
        var newvalues = await { $set: { status:req.body.status} };
      const data=await  task.updateOne({_id:req.body.id}, newvalues)
      res.status(200).send(data)
    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }

})

router.post("/updatesubtask",async(req,res)=>{
    if(req.body.status==null){
        res.status(200).send({
            Error:"provide status"
        })
        return;
    }
    if(req.body.id==null){
        res.status(200).send({
            Error:"provide user id"
        })
        return;
    }
    if(req.body.status!=0 && req.body.status!=1 ){
        res.status(200).send({
            Error:"Not a valid value of status"
        })
        return;
    }
    try{

        var newvalues = { $set: { status:req.body.status} };
        const data=await  subtask.updateOne({_id:req.body.id}, newvalues)

        let newdata =await subtask.findById(req.body.id)
        const taskId=newdata.taskId
        const counttask1=await subtask.find({taskId,status:1})
        const counttask0=await subtask.find({taskId,status:0})
        // console.log(counttask1.length,counttask2.length)
        let newd;
        if(counttask1.length==0){
            newd = await { $set: { status:"TODO"} };
           
        }else if(counttask1.length>0 && counttask0.length!=0){
            newd = await { $set: { status:"“IN_PROGRESS”"} };
        }else if(counttask0.length==0){
            newd = await { $set: { status:"“DONE”"} };
        }
        const datax=await  task.updateOne({_id:taskId}, newd)

        res.status(200).send(data)
    }catch(e){
        res.status(200).send({
            "Error":e
        })
    }
})
router.get("/singletask",async(req,res)=>{
    try{
        const data=await task.findById(req.body.id)
        res.send(data)
    }catch{

    }
})
module.exports = router;