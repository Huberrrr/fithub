import { Alert } from 'react-native';
//Global helper functions pertaining to posting, requesting, editing, adding etc.to workouts.
import { getUserToken, getUserID, getUserUID } from '../lib/AccountFunctions';

export async function postWorkout(workout) {
    const id = await getUserID();
    const uid = await getUserUID();
    const token = await getUserToken();
    workout.uid = uid;
    workout.id = id;
    workout.token = token;

    let date = new Date();
    let offsetInHours = date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() - offsetInHours);
    workout.date = date.toJSON().slice(0, 10);
 
    console.log(JSON.stringify(workout));
    fetch('https://fithub-server.herokuapp.com/workouts/new', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workout)
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

// Return a users workout plans where id is the id of the user
export async function getWorkouts(id) {
    let response = await fetch('https://fithub-server.herokuapp.com/workouts/user/'+id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });
    return await response.json();
}

// Get the public workouts where muscles is an array of muscle
// that the user wants. Leave empty if you want all public
// workouts returned. Usage : muscles = [4, 3, 10]
export async function getPublicWorkouts(muscles) {
    let response = await fetch('https://fithub-server.herokuapp.com/workouts/public', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(muscles)
    });
    let json = await response.json();
    return json;
}

