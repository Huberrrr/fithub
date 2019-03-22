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
  ListItem,
  Modal,
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
    modalVisible: false,
    workouts: [],
    savedWorkout: null,

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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
        this.setState({ savedWorkout: data });
        let builtWorkouts = [];
        let s = JSON.stringify(data);
        let array = JSON.parse(s);
        for (let x = 0; x < array.length; x++) {
          let exercises = [];
          let workouts = [];
          for (let y = 0; y < array[x].exercises.length; y++) {
            let fixedSets = [];
            for (let z = 0; z < array[x].exercises[y].sets.length; z++) {
              let setobj = {
                isWarmup: array[x].exercises[y].sets[z].isWarmup,
                reps: array[x].exercises[y].sets[z].reps,
                weight: array[x].exercises[y].sets[z].weight
              }
              fixedSets.push(setobj);
            }
            exercises.push({
              exists: false,
              name: array[x].exercises[y].name,
              muscle_groups: array[x].exercises[y].muscle_groups,
              equipment_type: array[x].exercises[y].equipment_type,
              sets: fixedSets

            });
          }//for
          builtWorkouts.push({
            id: "",
            uid: "",
            token: "",
            public: false,
            description: array[x].description,
            name: array[x].name,
            workout: array[x].name,
            user: array[x].ownerUID, //replace with user's profile name later
            icon: "person",
            date: new Date().toJSON().slice(0, 10),
            exercises: exercises
          })
        }//for
        console.log(builtWorkouts);
        this.setState({ workouts: builtWorkouts })


      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text style={styles.title}>Feed</Text>
          </View>
          <View style={styles.search}>
            <TouchableOpacity>
              <Icon
                style={{ right: 10 }}
                name="filter"
                type="MaterialDesignIcons"
                size={30}
              //onPress={() => this.setModalVisible()}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon
                name="magnifying-glass"
                type="entypo"
                size={30}
                onPress={() => this.props.navigation.navigate('Search')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.workouts}
          renderItem={({ item }) => (
            <WorkoutCard
              fullWorkout={{
                id: "",
                uid: "",
                token: "",
                public: false,
                description: item.description,
                name: item.name,
                exercises: item.exercises,
                date:item.date
              }}
              workout={item.workout}
              user={item.user}
              userPhoto={item.icon}
              exercises={item.exercises}
              navigation={this.props.navigation}
            />
          )}
        />

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
          style={{ flex: 1 }}>

        </Modal>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 35,
    padding: 5,
  },
  title: {
    fontSize: 25,
    left: 5,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    right: 15,
    //bottom: 30,
  },
})
