const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const apiCtrl = require('./api/apiCtrl');

//api

router.post('/users/login', apiCtrl.login);                     //Login a user
router.get('/profile/:id/', apiCtrl.profile);                   //Get a users profile
router.get('/profile/:id/stats', apiCtrl.stats);
router.get('/profile/:id/dates', apiCtrl.dates);
router.get('/profile/:id/activity', apiCtrl.activity);
router.get('/users', apiCtrl.users);
router.post('/profile/editName', apiCtrl.editUsername);          //Get a users CUSTOM exercises

router.get('/workouts/user/:id', apiCtrl.workouts);             //Get a users workout plans
router.post('/workouts/public', apiCtrl.publicWorkouts);        //Get (and filter) the public workouts
router.post('/workouts/new', apiCtrl.newWorkout);               //Post a new workout plan
router.post('/workouts/delete', apiCtrl.delWorkout);            //Post a workout deletion to a user profile

router.get('/exercises/', apiCtrl.exercises);                   //Get the standard exercises
router.get('/exercises/:id', apiCtrl.uExercises);               //Get a users CUSTOM exercises
router.post('/exercises/new', apiCtrl.newExercise);             //Post a custom exercise to a user profile
router.post('/exercises/delete', apiCtrl.delExercise);          //Post an exercise deletion to a user profile
router.post('/exercises/edit', apiCtrl.editExercise);           //edit a user's private exercise1

router.get('/logs/:id', apiCtrl.logs);                          //Get a users workout logs
router.post('/logs/new', apiCtrl.newLog);                       //Post a users workout

module.exports = router;
