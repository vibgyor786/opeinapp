const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const user = require("./routes/user");
const save = require("./routes/save");
const deletefile=require('./routes/delete')
const cron = require("node-cron"); 
require("dotenv").config();
const cronjobfuntion=require('./helper/cronjob')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



// <-----------------------mongoose connection------------------------->
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));





app.use(bodyParser.json());
app.use(cors());


// <-----------------------mongoose connection------------------------->
app.use("/user", user);
app.use("/save", save);
app.use('/delete',deletefile)



cron.schedule("*/10 * * * * ", function() { 
  cronjobfuntion()
}); 

app.get("/", (req, res) => {
  res.send("app is working");
});
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.listen(port, host, function () {
  console.log("Server started.......");
});
