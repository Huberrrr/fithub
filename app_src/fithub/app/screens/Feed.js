import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
  ListItem
} from 'react-native';
import Dash from 'react-native-dash';
import { Icon, Button } from 'react-native-elements';
import WorkoutCard from '../components/WorkoutCard';

export default class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Feed',
      headerRight: <Icon
        name="magnifying-glass"
        type="entypo"
        size={30}
        onPress={() => { navigation.push('otherUserProfile') }} />
    }
  };

  constructor(props) {
    super(props);
  }

  state = {
    //dummy workout cards to test look of UI
    /*workouts: [
      {
        workout: "Dorito", user: "Brian", icon: "person",
        exercises: [
          { name: "Bench Press" },
          { name: "Bicep Curls" },
          { name: "Front Squat" },
        ]
      },
      {
        workout: "Big Werk", user: "Andy", icon: "person",
        exercises: [
          { name: "Cardio" },
          { name: "Lat Pulldown" },
          { name: "Curls" },
        ]
      },
      {
        workout: "The Grind", user: "Colin", icon: "person",
        exercises: [
          { name: "Bench Press" },
          { name: "Bicep Curls" },
          { name: "Front Squat" },
        ]
      },
      { workout: "Dorito", user: "Brian", icon: "person" },
      { workout: "Big Werk", user: "Andy", icon: "person" },
      { workout: "The Grind", user: "Colin", icon: "person" },
      { workout: "Dorito", user: "Brian", icon: "person" },
      { workout: "Big Werk", user: "Andy", icon: "person" },
      { workout: "The Grind", user: "Colin", icon: "person" },
    ]*/

    workouts: []
  }

  componentDidMount() {
    fetch('https://fithub-server.herokuapp.com/workouts/public', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exercises: [] })
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let builtWorkouts = [];
        let s = JSON.stringify(data);
        let array = JSON.parse(s);
        for (let x = 0; x < array.length; x++) {
          let exercises = [];
          let workouts = [];
          for (let y = 0; y < array[x].exercises.length; y++) {
            exercises.push({ name: array[x].exercises[y].name });
          }//for
          builtWorkouts.push({
            workout: array[x].name,
            user: array[x]._id, //replace with user's profile name later
            icon: "person",
            exercises: exercises
          })
        }//for

        this.setState({ workouts: builtWorkouts })


      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.search}>
          <TouchableOpacity>
            <Icon
              name="magnifying-glass"
              type="entypo"
              size={30}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.workouts}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>this.props.navigation.push('otherUserProfile')}>
              <WorkoutCard
                workout={item.workout}
                user={item.user}
                userPhoto={item.icon}
                exercises={item.exercises}
              />
            </TouchableOpacity>

          )}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row-reverse',
    right: 15,
    bottom: 30,
  },
})
