const user=require('../schemas/userSchema')
const task=require('../schemas/task')
const subtask=require('../schemas/subTask')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function cron(){
    console.log("cron job in execution")
    try{
        let calldata=[]
        const data=await user.find()
        let p=0;
        for(let i=0;i<data.length;i++){
            const usertaskdata=await task.find({userId:data[i]._id,isdeleted:false,dueDate:{"$lte": new Date()}})
            // console.log(usertaskdata)
            const usertaskdatall=await task.find({userId:data[i]._id,isdeleted:false})
    
            if(usertaskdata.length>0 && usertaskdatall.length>0){
                console.log(`changing priority for user having phone no. : ${data[i].phoneNumber}`)
                calldata.push(data[i].phoneNumber)
                const x=await user.findByIdAndUpdate(data[i]._id,{$set:{priority:p}})
                p=p+1;
            }
           
        }

        console.log('voice call')
        for(let i=0;i<calldata.length;i++){
            if(calldata[i]!='+918979891106'){
                continue;
            }
            console.log('voice call for phone no :'+calldata[i])
            client.calls
            .create({
               url: 'https://handler.twilio.com/twiml/EHf151282b5664826ccedf20690787d3e5',
             
               to: `${calldata[i]}`,
               from: '+1 659 215 7425'
             })
            .then(call => console.log(call));
        }
       



    }catch(e){
        console.log("Error occured while doing cron job"+e)
        return;
    }

    console.log("execution successfull")
 
}

module.exports=cron