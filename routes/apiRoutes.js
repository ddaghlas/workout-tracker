// Import express router
const router = require("express").Router();
const Workout = require("../models/Workout.js");

// Import workout model
// const db = require("../models/exercise");

// Route to get workouts
router.get("/workouts", (req, res) => {
	// Get workout data, aggregating exercise duration into a field named totalDuration
	  Workout.aggregate([
		{
		  '$sort': {
			'day': 1
		  }
		}, {
		  '$addFields': {
			'totalDuration': {
			  '$sum': '$exercises.duration'
			}
		  }
		}
	  ])
		.then((dbWorkout) => {
		  res.status(200).json(dbWorkout);
		})
		.catch((err) => {
		  res.status(400).json(err);
		});
	});
	
	// Route to add exercises
	router.put("/workouts/:id", (req, res) => {
	  Workout.findByIdAndUpdate(req.params.id, {
		$push: { exercises: req.body }
	  })
		.then((dbExercise) => {
		  res.status(200).json(dbExercise);
		})
		.catch((err) => {
		  res.status(400).json(err);
		});
	});
	
	// Route to create a new workout
	router.post("/workouts", (req, res) => {
	  Workout.create(req.body)
		.then((workout) => {
		  res.status(200).json(workout);
		})
		.catch((err) => {
		  res.status(400).json(err);
		});
	});
	
	// Route to return a range of workouts
	// Exercise duration is aggregated to totalDuration
	router.get("/workouts/range", (req, res) => {
	  Workout.aggregate([
		{
		  '$sort': {
			'day': -1
		  }
		}, {
		  '$limit': 7
		}, {
		  '$addFields': {
			'totalDuration': {
			  '$sum': '$exercises.duration'
			}
		  }
		},{
		  '$sort': {
			'day': 1
		  }
		}
	  ])
		.then((dbWorkout) => {
		  res.status(200).json(dbWorkout);
		})
		.catch((err) => {
		  res.status(400).json(err);
		});
	});
	
	module.exports = router;