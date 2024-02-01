const express = require("express");
const app = express();
const router = express.Router();
const { jwtDecode } = require("jwt-decode");
const user = require("../schemas/userSchema");
const task = require("../schemas/task");
const subtask = require("../schemas/subTask");

router.post("/task", async (req, res) => {
  // <-----------------------checkking all the parameters are present inside the body------------------------->
  if (
    req.body.token == null ||
    req.body.title == null ||
    req.body.dueDate == null ||
    req.body.description == null
  ) {
    res.status(200).send({
      Error: "Please provide all details : token,title,due date, description",
    });
  }

  // <-----------------------jwt decoding------------------------->
  const sampleTask = req.body.token;
  const decodedid = jwtDecode(sampleTask);

  // <-----------------------getting date , month , year from duedate------------------------->
  const day = new Date(req.body.dueDate).getDate();
  const month = new Date(req.body.dueDate).getMonth();
  const year = new Date(req.body.dueDate).getFullYear();
  const today = new Date();

  // <-----------------------today's date------------------------->
  const datetoday = today.getDate();
  const monthtoday = today.getMonth();
  const yearday = today.getFullYear();
  let priority = 0;

  // <-----------------------setting priority------------------------->

  // <-----------------------if due date year is greater than current year------------------------->
  if (yearday < year) {
    priority = 3;
  }

  // <-----------------------if due date month is greater than current month------------------------->
  else if (monthtoday < month) {
    priority = 3;
  }

  // <-----------------------if due date month and year is same then check for date------------------------->
  else {
    if (day - datetoday == 0) {
      priority = 0;
    } else if (day - datetoday == 1) {
      priority = 1;
    } else if (day - datetoday == 2) {
      priority = 2;
    } else {
      priority = 3;
    }
  }

  // <-----------------------saving data to new task with user id from jwt token------------------------->

  try {
    const newtask = new task({
      userId: decodedid.id,
      title: req.body.title,
      dueDate: new Date(req.body.dueDate),
      description: req.body.description,
      priority,
    });

    const data = await newtask.save();
    res.status(200).send(data);
  } catch (e) {
    res.status(200).send({
      Error: e,
    });
  }
});

// <-----------------------saving new subtask------------------------->
router.post("/subtask", async (req, res) => {
  // <-----------------------checking taskid is present in the body------------------------->

  if (req.body.taskId == null) {
    res.status(200).send({
      Error: "provide taskID",
    });
  }
  try {
    // <-----------------------saving new task------------------------->

    const data = new subtask(req.body);
    const save = await data.save();
    res.status(200).send(save);
  } catch (e) {
    res.status(200).send({
      Error: e,
    });
  }
});

// <-----------------------updating task date ------------------------->
router.post("/updatetaskdate", async (req, res) => {
  // <-----------------------checking due date and unique id is present or not------------------------->
  if (req.body.dueDate == null) {
    res.status(200).send({
      Error: "provide due date",
    });
  }
  if (req.body.id == null) {
    res.status(200).send({
      Error: "provide user id",
    });
  }

  // <-----------------------checking the priority according to previous logic------------------------->
  const day = new Date(req.body.dueDate).getDate();
  const month = new Date(req.body.dueDate).getMonth();
  const year = new Date(req.body.dueDate).getFullYear();
  const today = new Date();

  const datetoday = today.getDate();
  const monthtoday = today.getMonth();
  const yearday = today.getFullYear();
  let priority = 0;

  if (yearday < year) {
    priority = 3;
  } else if (monthtoday < month) {
    priority = 3;
  } else {
    if (day - datetoday == 0) {
      priority = 0;
    } else if (day - datetoday == 1) {
      priority = 1;
    } else if (day - datetoday == 2) {
      priority = 2;
    } else {
      priority = 3;
    }
  }

  try {
    // <---------------saving updated due date and chaging prority according to that---------------------->
    var newvalues = { $set: { dueDate: req.body.dueDate, priority } };
    const data = await task.updateOne({ _id: req.body.id }, newvalues);
    res.status(200).send(data);
  } catch (e) {
    res.status(200).send({
      Error: e,
    });
  }
});

// <-----------------------updating task status ------------------------->
router.post("/updatetaskstatus", async (req, res) => {
  // <-----------------------checking status and unique id is present in body or not------------------------->
  if (req.body.status == null) {
    res.status(200).send({
      Error: "provide status",
    });
  }
  if (req.body.id == null) {
    res.status(200).send({
      Error: "provide user id",
    });
  }

  try {
    // <-----------------------checking status is done ------------------------->
    if (req.body.status == "DONE") {
      // <---------------------id it is done it means we have to change sub task status to 1------------------->
      var newsub = { $set: { status: 1 } };
      const data = await subtask.updateMany({ taskId: req.body.id }, newsub);
    }

    var newvalues = await { $set: { status: req.body.status } };
    const data = await task.updateOne({ _id: req.body.id }, newvalues);
    res.status(200).send(data);
  } catch (e) {
    res.status(200).send({
      Error: e,
    });
  }
});

// <-----------------------updating  sub task------------------------->
router.post("/updatesubtask", async (req, res) => {
  // <-----------------------checking status and unique id is present in the body ------------------------->
  if (req.body.status == null) {
    res.status(200).send({
      Error: "provide status",
    });
    return;
  }
  if (req.body.id == null) {
    res.status(200).send({
      Error: "provide user id",
    });
    return;
  }

  // <-----------------------subtask status cannot be other than 0 or 1------------------------->
  if (req.body.status != 0 && req.body.status != 1) {
    res.status(200).send({
      Error: "Not a valid value of status",
    });
    return;
  }
  try {
    // <-----------------------updating current sub task------------------------->
    var newvalues = { $set: { status: req.body.status } };
    const data = await subtask.updateOne({ _id: req.body.id }, newvalues);

    // <-----------------------after updating current sub task check whether we completed all our other sub tasks------------------------->
    let newdata = await subtask.findById(req.body.id);
    const taskId = newdata.taskId;

    // <-----------------------get the number of sub task completed and pending------------------------->
    const counttask1 = await subtask.find({ taskId, status: 1 });
    const counttask0 = await subtask.find({ taskId, status: 0 });

    // <-----------------------depending upon number of sub task completion set priority------------------------->
    let newd;
    if (counttask1.length == 0) {
      newd = await { $set: { status: "TODO" } };
    } else if (counttask1.length > 0 && counttask0.length != 0) {
      newd = await { $set: { status: "“IN_PROGRESS”" } };
    } else if (counttask0.length == 0) {
      newd = await { $set: { status: "“DONE”" } };
    }

    // <-----------------------updating main task with the priority------------------------->
    const datax = await task.updateOne({ _id: taskId }, newd);

    res.status(200).send(data);
  } catch (e) {
    res.status(200).send({
      Error: e,
    });
  }
});

// <-----------------------get request for single task------------------------->
router.get("/singletask", async (req, res) => {
  try {
    const data = await task.findById(req.body.id);
    res.send(data);
  } catch {}
});
module.exports = router;
