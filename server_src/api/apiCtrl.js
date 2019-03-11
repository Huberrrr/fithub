const mongoose = require('mongoose');
const schemaCtrl = require('../models/schema');
const url = "mongodb://admin:team5307@fithub-database-shard-00-00-3xylr.gcp.mongodb.net:27017,fithub-database-shard-00-01-3xylr.gcp.mongodb.net:27017,fithub-database-shard-00-02-3xylr.gcp.mongodb.net:27017/test?ssl=true&replicaSet=fithub-database-shard-0&authSource=admin&retryWrites=true";
const passport = require('../config/passport');

mongoose.connect(url, {
  useNewUrlParser: true
});

let db = mongoose.connection;
db.once('open', () => {
});

let muscleEnums = {
  "NECK": 1,
  "SHOULDERS": 2, 
  "DELTOID": 3,
  "TRICEPS": 4,
  "BICEPS": 5,
  "FOREARMS": 6,
  "BACK": 7,
  "LATS": 8,
  "TRAPS": 9,
  "CHEST": 10,
  "WAIST": 11,
  "OBLIQUES": 12,
  "HIPS": 13,
  "GLUTES": 14,
  "THIGHS": 15,
  "QUADS": 16,
  "HAMSTRINGS": 17, 
  "CALVES": 18
}

function isConnected(req, res) {
  if (db.readystate == 0) {
    res.status(500).send({ error: "Error: Database connection is down"});
    return false;
  }
  else{
    return true;
  }
}

function isValidated(req, res, user) {
  if (!user) 
  {
    res.status(404).send({ message: "User not found" });
    return false;
  }
  else if (user.uid != req.body.uid || user.token != req.body.token) 
  {
    res.status(401).send({ message: "Unauthorized" });
    return false;
  }
  else{
    return true;
  }
}

//Register a user
let login = function login(req, res) {
  passport.authenticate('googleToken', {
    session: false
  }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        "message": "Error"
      });
      return;
    } else {
      res.status(200).send({
        "id": user._id,
        "uid": user.uid,
        "token": user.token
      });
    }
  })(req, res);
}

/*--------Functions for posting user information--------*/

//Create a new workout plan under a user
let newWorkout = async function newWorkout(req, res) {
  if(!isConnected(req, res)){ return console.log("DB is offline");}
  let user = await schemaCtrl.Profile.findById(req.body.id).catch(err => {console.log("invalid id");});
  if(!isValidated(req, res, user)){ console.log("Unauthorized request"); return; }

  //Construct the exercise documents and keep track of their IDs
  let exercise_ids = [];
  for(let i = 0; i < req.body.exercises.length; i++){
    let exercise = req.body.exercises[i];
    if(exercise.exists) { //exercise exists
      try{
        let findExercise = await schemaCtrl.Exercise.findById(exercise.id, (err, exercise) => {
            //exercise confirmed to exist, push _id
            exercise_ids.push(mongoose.Types.ObjectId(exercise._id));
        });
      }catch(err){
        return res.status(404).send({ message: "Database Error: Exercise claimed to exist not found" });
      }
    }
  } //end findbyId
} //end newWorkout

//Log a user's workout into the DB
let newLog = function newLog(req, res) {
    /*
    let exerciseData_ids = [];
    let setData = [];
    //Construct the exerciseData objects
    req.body.exercises.forEach(exercise => 
    {
      //build setData objects for the current exercise
      let setData_ids = [];
      exercise.sets.forEach(set =>
      {

        //For keeping track of user maxes
        if(user.max[exercise.name].exists){
          if(user.max[exercise.name] < set.weight){
            user.max[exercise.name] = set.weight;
          }
        } else {
          user.max[exercise.name] = set.weight;
        }
        //For keeping track of user workout dates
        if(user.dates[exercise.date].exists){
          user.dates[exercise.date]++;
        } else {
          user.dates[exercise.date] = 1;
        }

        let newSetData = new schemaCtrl.SetData(set);
        let dataQuery = newSetData.save(); 
        let dataPromise = dataQuery.exec();
        dataPromise.then((data) =>{
          console.log(data);  
          if (!data) 
            {
              console.log(err);
              res.status(500).send({ "message": "Database Error: Error while saving exercise set log" });
              return;
            } 
        });
        setData_ids.push(mongoose.Types.ObjectId(newSetData._id));
      }); //end forEach set

      //build exerciseData objects for the workoutData
      let newExerciseData = new schemaCtrl.ExerciseData
      ({
        name: exercise.name,
        muscle_groups: exercise.muscle_groups,
        sets: setData_ids
      });

      //save the exerciseData
      newExerciseData.save((err, newExerciseData) => 
      {
        if (err) 
        {
          console.log(err);
          res.status(500).send({ "message": "Database Error: Error while saving exercise log" });
          return;
        } 
      }); //end save
      exerciseData_ids.push(mongoose.Types.ObjectId(newExerciseData._id));
    }); //end forEach exercise, all exerciseData documents have been built and saved

    //Construct the workoutData object
    let newWorkoutData = new schemaCtrl.WorkoutData(
    {
      name: req.body.name,
      date: req.body.date,
      exercises: exerciseData_ids
    });

    let workoutQuery = newWorkoutData.save();
    let workoutPromise = workoutQuery.exec();
    workoutPromise.then(data => {
      console.log(data);
      if (!data) 
      {
        res.status(500).send({ "message": "Database Error: Error while saving workout log" });
        return;
      }
        //Push the newWorkout log to the user profile
      let userWorkout = user.updateOne({$push: {logs: newWorkoutData}}, {});
      let userPromise = userWorkout.exec();
      userPromise.then(data => {
        if (!data) 
        {
          res.status(500).send({"message": "Error: Log addition unsuccessful"});
          return;
        } 
        else 
        {
          res.status(200).send({"message": "Log added successfully "});
          return;
        }
      }); //end updateOne 
    });

    
  }); //end findById
*/
if(!isConnected(req, res)){ return console.log("DB is offline");}
  let user = await schemaCtrl.Profile.findById(req.body.id).catch(err => {console.log("invalid id");});
  if(!isValidated(req, res, user)){ console.log("Unauthorized request"); return; }

  //Construct the exercise documents and keep track of their IDs
  let exercise_ids = [];
  for(let i = 0; i < req.body.exercises.length; i++){
    let exercise = req.body.exercises[i];
    if(exercise.exists) { //exercise exists
      try{
      let findExercise = await schemaCtrl.Exercise.findById(exercise.id, (err, exercise) => {
          //exercise confirmed to exist, push _id
          exercise_ids.push(mongoose.Types.ObjectId(exercise._id));
      });
      }catch(err){
        return res.status(404).send({ message: "Database Error: Exercise claimed to exist not found" });
      }
    }
    else{ //create exercise on the fly
      //creating set data for the exercise
      let set_ids = [];
      for(let j = 0; j < exercise.sets.length; j++){
        let set = exercise.sets[j];
        let new_set;
        try{
          new_set = await schemaCtrl.Set.create(set);
        }catch(validation_err){ console.log("Input Error: invalid json input at Set"); return res.status(500).send({ "message": "Input Error: Validation error while constructing set" })};
        new_set.save(function (err, ret) {
          if(err){ return res.status(500).send({ message: "Database error: unable to save set data" });}
        });
        set_ids.push(mongoose.Types.ObjectId(new_set._id)); //push saved set to array
      }; //end forEach exercise.set

      let newExercise;
      try{
      newExercise = await schemaCtrl.Exercise.create({ //create new exercise
        name: exercise.name,
        muscle_groups: exercise.muscle_groups,
        equipment_type: exercise.equipment_type,
        sets: set_ids,
      });
      }catch(validation_err){ console.log("Input Error: invalid json input at exercise"); return res.status(500).send({ "message": "Input Error: Validation error while constructing exercise" })};

      newExercise.save((err, newExercise) => { //save new exercise
        if (err) {
          console.log("error saving exercise");
          res.status(500).send({ "message": "Database error: Error saving exercise to database" });
          return false;
        }
        else{
          user.updateOne({$push: { exercises: newExercise._id }}, {}, (err, raw) => {
            if (err) {
              console.log(err);
              res.status(500).send({ "message": "Database Error: Error while pushing exercise to user profile" });
              return true;
            }
          }); //end updateOne
        }
      }); //end save
      exercise_ids.push(mongoose.Types.ObjectId(newExercise._id));
    }
  }; //end foreach exercise


  //Construct the workout JSON object
  let newWorkout;
  try{
  newWorkout = await schemaCtrl.WorkoutPlan.create({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    exercises: exercise_ids,
    ownerUID: req.body.id,
  });
  }catch(validation_err){ console.log("Input Error: invalid json input at workout"); return res.status(500).send({ "message": "Input Error: Validation error while constructing workout" })};

  //save the workout to the master workout collection
  newWorkout.save((err, newWorkout) => {
    if (err) {
      console.log("error saving workout");
      res.status(500).send({ "message": "Database Error: Error while saving new workout plan" });
      return;
    } 
    else {
      user.updateOne({$push: { workouts: newWorkout._id }}, {}, (err, raw) => {
        if (err) {
        console.log("error pushing workout into profile");
          res.status(500).send({ "message": "Database Error: Error while pushing workout plan to user profile" });
          return;
        }
        else {
          res.status(200).send({ "message": "Workout added successfully" });
          return;
        }
      }); //end updateOne
    }
  }); //end save
} //end newWorkout

//Log a user's workout into the DB
let newLog = async function newLog(req, res) {
  if(!isConnected(req, res)){ return console.log("DB is offline");}
  let user = await schemaCtrl.Profile.findById(req.body.id).catch(err => {console.log("invalid id");});
  if(!isValidated(req, res, user)){ console.log("Unauthorized request"); return; }

  //validate setData json input

  let exerciseData_ids = [];
  //Construct the exerciseData objects
  for(let i = 0; i < req.body.exercises.length; i++){
    let exercise = req.body.exercises[i];

    //build setData objects for the current exercise
    let setData_ids = [];
    for(let j = 0; j < exercise.sets.length; j++){
      let set = exercise.sets[j];

      let newSetData; 
      try{
      newSetData = await schemaCtrl.SetData.create(set);
      }catch(validation_err){ console.log("Input Error: invalid json input at SetData"); return res.status(500).send({ "message": "Input Error: Validation error while constructing setData" })};

      newSetData.save((err, newSetData) => {
        if (err) {
          console.log(err); return res.status(500).send({ "message": "Database Error: Error while saving exercise set log" });
        } 
      }); //end save
      setData_ids.push(mongoose.Types.ObjectId(newSetData._id));
    }; //end forEach set

    //build exerciseData objects for the workoutData
    let newExerciseData;
    try{
      newExerciseData = await schemaCtrl.ExerciseData.create({
        name: exercise.name,
        muscle_groups: exercise.muscle_groups,
        sets: setData_ids
      });
    }catch(validation_err){ console.log("Input Error: validation error creating ExerciseData"); return res.status(500).send({ "message": "Input Error: Validation error while constructing exerciseData" })};

    //save the exerciseData
    newExerciseData.save((err, newExerciseData) => {
      if (err) {
        console.log(err); return res.status(500).send({ "message": "Database Error: Error while saving exercise log" });
      } 
    }); //end save
    exerciseData_ids.push(mongoose.Types.ObjectId(newExerciseData._id));
  }; //end forEach exercise, all exerciseData documents have been built and saved

  //Construct the workoutData object, catch validation error
  let newWorkoutData;
  try{
    newWorkoutData = await schemaCtrl.WorkoutData.create({
    name: req.body.name,
    date: req.body.date,
    exercises: exerciseData_ids
    });
  }catch(validation_err){ console.log("Input Error: validation failed creating WorkoutData"); return res.status(500).send({ "message": "Input Error: Validation error while constructing workoutData" })};

  newWorkoutData.save((err, newWorkoutData) => {
    if (err) {
      console.log(err); return res.status(500).send({ "message": "Database Error: Error while saving workout log" });
    } 
    else{
      //Push the newWorkout log to the user profile
      console.log(newWorkoutData._id);
      user.updateOne({$push: {logs: newWorkoutData._id}}, (err) => {
        if (err) {
          res.status(500).send({"message": "Error: Log addition unsuccessful"});
          return;
        } 
        else {
          res.status(200).send({"message": "Log added successfully "});
          return;
        }
      }); //end updateOne
    }
  }); //end save


    user.updateOne({$set: {maxes: user.maxes}}, {}, (err, raw) => {});
    user.updateOne({$set: {dates: user.dates}}, {}, (err, raw) => {});
    //Push the newWorkout log to the user profile
    user.updateOne({$push: {logs: newWorkoutData}}, {},(err, raw) => 
    {
      if (err) 
      {
        res.status(500).send({"message": "Error: Log addition unsuccessful"});
        return;
      } 
      else 
      {
        res.status(200).send({"message": "Log added successfully "});
        return;
      }
    }); //end updateOne
} //end newLog

let newExercise = async function newExercise(req, res) {
  if(!isConnected(req, res)){ return console.log("DB is offline"); };
  //Find the user
  let user = await schemaCtrl.Profile.findById(req.body.id).catch(err => {console.log("invalid id");});
  if(!isValidated(req, res, user)){ console.log("Unauthorized request"); return; };

  //validate json synchronously
  try{
    for(let i = 0; i < req.body.sets.length; i++){
      set = req.body.sets[i];
      let validate = await schemaCtrl.Set.create(set);
    };
  }catch(validation_err){ res.status(500).send({ message: "Input error: validation failed for json set input" }); return console.log("validation error in creating sets"); };

  //validation successful, create the sets and save
  let set_ids= [];
  req.body.sets.forEach(set =>
  {
    let new_set = new schemaCtrl.Set(set);
    new_set.save();
    set_ids.push(mongoose.Types.ObjectId(new_set._id)); //push saved set to array
  });

  //validate exercise input
  try{
    let new_exercise = await schemaCtrl.Exercise.create
    ({
      name: req.body.name, //string
      muscle_groups: req.body.muscle_groups, //array of strings
      equipment_type: req.body.equipment_type, //string
      sets: set_ids
    });
  }catch(validation_err){ res.status(500).send({ message: "Input error: validation failed for json exercise input" }); return console.log("validation error in creating exercise"); }

  //validation successful, construct exercise
  let new_exercise = new schemaCtrl.Exercise
  ({
    name: req.body.name, //string
    muscle_groups: req.body.muscle_groups, //array of strings
    equipment_type: req.body.equipment_type, //string
    sets: set_ids
  });

  new_exercise.save(function (err, ret) {
    if(err){
      res.status(500).send({ message: "Database error: unable to save new exercise data" });
      return;
    }
  });

  //push to user profile
  user.updateOne({$push: { exercises: new_exercise._id }}, {},(err, raw) => {
    if (err) {
      res.status(500).send({ "message": " Error: Exercise addition unsuccessful" });
    }
    else {
      res.status(200).send({ "message": " Exercise added successfully " });
    }
  }); //end updateOne
} //end new exercise


/*--------Functions for returning user information--------*/

//Get a user's logs from the database
let logs = function logs(req, res) {
  if(!isConnected(req, res))
  {
    return;
  }

  let query = schemaCtrl.Profile.findById(req.params.id, 'logs').populate
  ({
      path: "exercises",
      select: "-__v",
      populate:
      {
        path: "sets",
        model: "Set",
        select: "-__v"
      }
    }
  );
  let promise = query.exec();
  promise.then((data) => {
    if(!data){
      res.status(404).send({ "message": "Database Error: User not found" });
      return
    } else {
      res.status(200).send(data);
    }
  }) //end findById
   //end populate


  
/*
  let data = schemaCtrl.Profile.findById(req.params.id, (err, user) => 
  {
    if(err){
      res.status(404).send({ "message": "Database Error: error querying profile" });
      return
    }
    else if(!user){
      res.status(500).send({ "message": "Database Error: User not found" });
      return
    }
  }) //end findById
  .select("-email -workouts -exercises -avatar -__v -token")
  .populate
  ({
    path: "logs",
    select: "-__v",
    populate:
    {
      path: "exercises",
      select: "-__v",
      populate:
      {
        path: "sets",
        select: "-__v",
      }
    }
  }) //end populate
  .exec((err, data) =>
  {
    if(err)
    {
      res.status(500).send({ "message": "Database Error: Populate query failed" });
      return;
    }
    else{
      res.status(200).send(data);
    }
  });
  */
}

//Return a users workouts
let workouts = function workouts(req, res) {
  if(!isConnected(req, res))
  {
    return;
  }

  let query = schemaCtrl.Profile.findById(req.params.id, 'workouts').populate
  ({
      path: "exercises",
      select: "-__v",
      populate:
      {
        path: "sets",
        model: "Set",
        select: "-__v"
      }
    }
  );
  let promise = query.exec();
  promise.then((data) => {
    if(!data){
      res.status(404).send({ "message": "Database Error: User not found" });
      return
    } else {
      res.status(200).send(data);
    }
  }) //end findById
   //end populate
/*
  let data = schemaCtrl.Profile.findById(req.params.id, (err, user) => 
  {
    if(err){
      res.status(404).send({ "message": "Database Error: error querying profile" });
      return
    }
    else if(!user){
      res.status(500).send({ "message": "Database Error: User not found" });
      return
    }
  }) //end findById
  .select("-email -logs -exercises -avatar -__v -token")
  .populate
  ({
    path: "workouts",
    select: "-__v",
    populate:
    {
      path: "exercises",
      select: "-__v",
      populate:
      {
        path: "sets",
        model: "Set",
        select: "-__v"
      }
    }
  }) //end populate
  .exec((err, data) =>
  {
    if(err)
    {
      res.status(500).send({ "message": "Database Error: Populate query failed" });
      return;
    }
    else{
      res.status(200).send(data);
    }
  });
  */
}

//Return a users custom private exercises
let uExercises = function uExercises(req, res) {
  if(!isConnected(req, res))
  {
    return;
  }

  let data = schemaCtrl.Profile.findById(req.params.id, (err, user) => 
  {
    /*
    if(!isValidated(req, res, err, user)){
      return;
    }
    */
    if(err){
      res.status(404).send({ "message": "Database Error: error querying profile" });
      return
    }
    else if(!user){
      res.status(500).send({ "message": "Database Error: User not found" });
      return
    }
  }) //end findById
  .select("-email -logs -workouts -avatar -__v -token")
  .populate
  ({
    path: "exercises",
    select: "-__v",
    populate:
    {
      path: "sets",
      model: "Set",
      select: "-__v",
    }
  }) //end populate
  .exec((err, data) =>
  {
    if(err)
    {
      res.status(500).send({ "message": "Database Error: Populate query failed" });
      return;
    }
    else{
      res.status(200).send(data);
    }
  });
}

//Return a users general profile information
let profile = function profile(req, res) {
  if(!isConnected(req, res))
  {
    return;
  }

  let data = schemaCtrl.Profile.findById(req.params.id, (err, user) => 
  {
    /*
    if(!isValidated(req, res, err, user)){
      return;
    }
    */
    if(err){
      res.status(404).send({ "message": "Database Error: error querying profile" });
      return
    }
    else if(!user){
      res.status(500).send({ "message": "Database Error: user not found" });
      return
    }
  }) //end findById
  .select("-__v -token -uid -_id -workouts -exercises -logs")
  .exec((err, data) =>
  {
    if(err)
    {
      res.status(500).send({ "message": "Database Error: profile query failed" });
      return;
    }
    else{
      res.status(200).send(data);
    }
  });
}

//Return all standard exercises
let exercises = function exercises(req, res) {
  if (db.readyState == 0) {
    res.status(500).send({
      error: "Database connection is down."
    });
    return;
  }
  schemaCtrl.Exercise.find({}, (err, exercises) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        "message": "Error"
      });
    } else {
      res.status(200).send({
        "exercises": exercises
      });
    }
  });

}

let users = function users(req, res){
  if(db.readyState==0){
    res.status(500).send({
      error: "Database connection is down."
    });
    return;
  }
  let query = schemaCtrl.Profile.find({}).select('pseudonym _id');
  query.exec((err, users) => {
    res.status(200).send(users);
  });
}

let publicWorkouts = function publicWorkouts(req, res){
  if(db.readyState==0){
    res.status(500).send({
      error: "Database connection is down."
    });
    return;
  }
  let query = schemaCtrl.WorkoutPlan.find({}).select('-__v').populate({
    path: "exercises",
    select: "-__v",
    populate:
    {
      path: "sets",
      model: "Set",
      select: "-__v",
    }
  });
  query.exec((err, plans) => {
    res.status(200).send(plans);
  });
}

let dates = function dates(req, res){
  if(db.readyState==0){
    res.status(500).send({
      error: "Database connection is down."
    });
    return;
  }
  let query = schemaCtrl.Profile.findById(req.params.id).select("dates")
  let promise = query.exec();
  promise.then(data => {
    if(!data){
      res.status(500).send({ "message": "Database Error: user not found" });
      return
    }
    res.status(200).send(data);
  });
}

let stats = function stats(req, res){
  if(db.readyState==0){
    res.status(500).send({
      error: "Database connection is down."
    });
    return;
  }

  let query = schemaCtrl.Profile.findById(req.params.id).select("maxes")
  let promise = query.exec();
  promise.then(data => {
    if(!data){
      res.status(500).send({ "message": "Database Error: user not found" });
      return
    }
    res.status(200).send(data);
  });
}


let apiCtrl = {
  login: login,

  workouts: workouts,
  newWorkout: newWorkout,

  exercises: exercises,
  uExercises: uExercises,
  profile: profile,
  newExercise: newExercise,

  logs: logs,
  newLog: newLog,

  users: users,
  publicWorkouts: publicWorkouts,

  dates: dates,
  stats: stats

  //devExercise: devExercise
};

module.exports = apiCtrl;
