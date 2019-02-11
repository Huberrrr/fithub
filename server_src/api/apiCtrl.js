const mongoose = require('mongoose');
const schemaCtrl = require('../models/schema');
const url = "mongodb://admin:team5307@fithub-database-shard-00-00-3xylr.gcp.mongodb.net:27017,fithub-database-shard-00-01-3xylr.gcp.mongodb.net:27017,fithub-database-shard-00-02-3xylr.gcp.mongodb.net:27017/test?ssl=true&replicaSet=fithub-database-shard-0&authSource=admin&retryWrites=true";

var passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var configAuth = require('../config/auth')

//Used for login persistence
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new GoogleStrategy({
        clientID             : configAuth.googleAuth.clientID,
        clientSecret          : configAuth.googleAuth.clientSecret,
        callbackURL             : configAuth.googleAuth.callbackURL,
        passReqToCallback       : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));


function connectToDb() {
  mongoose.connect(url, { useNewUrlParser: true });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  return db;
}

//Register a user
let register = function register(req, res) {
  let db = connectToDb();
  db.once('open', () => {
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });
  });
}

let callback = function callback(req,res) { 
  console.log('callback');  
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  };
}

//Log a user in
let login = function login(req, res) {
  let db = connectToDb();
  db.once('open', () => {

  });
}

//Add a new workout into a users profile
let newWorkout = function newWorkout(req, res) {
  let db = connectToDb();
  db.once('open', () => {
    let newWorkout = new schemaCtrl.WorkoutSchema({
      name: req.body.name,
      description: req.body.description,
    });

    newWorkout.save(function (err, newWorkout) {
      if (err) return res.status(500).send({ message: 'Workout unsuccessfully added' });
      else res.status(200).send({ message: 'Workout successfully added' });
    });
  });
}

//Add a new exercise to a user's profile
let newExercise = function newExercise(req, res) {
  let db = connectToDb();
  db.once('open', () => {
    let newExercise = new schemaCtrl.ExerciseSchema({
      name: req.body.name,
      description: req.body.description,
    });

    newExercise.save(function (err, newExercise) {
      if (err) return res.status(500).send({ message: 'Exercise unsuccessfully added' });
      else res.status(200).send({ message: 'Exercise successfully added' });
    });
  });
}

//Log a user's workout into the DB
let logWorkout = function logWorkout(req, res) {
  let db = connectToDb();
  db.once('open', () => {
    let newLog = new schemaCtrl.LogSchema({
      exercise: req.body.exercise,
      data: req.body.data,
      dates: req.body.date
    });

    newLog.save(function (err, newLog) {
      if (err) return res.status(500).send({ message: 'Log unsuccessfully added' });
      else res.status(200).send({ message: 'Log successfully added' });
    });
  });
}

//Get a users workouts from DB
let workouts = function workouts(req, res) {
  let db = connectToDb();
  db.once('open', () => {
    schemaCtrl.workouts.find({name: req.body.name}, function(err, workouts){
      if(err){
        res.status(500).send({message: "Error getting workouts"});
      }
      else{
        res.send(workouts);
      }
    })
  });
}

//Get a users exercises from DB
let exercises = function exercises(req, res) {
  let db = connectToDb();
  db.once('open', () => {
  });
}


let apiCtrl = {
  login: login,
  callback: callback,
  register: register,
  newExercise: newExercise,
  newWorkout: newWorkout,
  logWorkout: logWorkout,
  workouts: workouts,
  exercises: exercises
}

module.exports = apiCtrl;
