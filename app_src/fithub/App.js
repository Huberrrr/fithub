import React from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import DetailScreen from './app/screens/Detail';

import Calendar from './app/Components/Calendar';
import BottomBar from './app/Components/BottomBar';
import WorkoutScreen from './app/screens/Workouts';


class HomeScreen extends React.Component {
  render() {
    if(Platform.OS === 'ios') {
      return (
        <SafeAreaView style={styles.containerIOS}>
          <View style={styles.calendar}>
            <Calendar navigation={this.props.navigation} />
          </View>
          <View style={styles.bottomBar}>
            <BottomBar />
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.containerAND}>
          <View style={styles.calendar}>
            <Calendar navigation={this.props.navigation} />
          </View>
          <View style={styles.bottomBar}>
            <BottomBar />
          </View>
        </View>
      );
    }
  }
  }

const styles = StyleSheet.create({
  containerIOS: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerAND: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  calendar: {
    flex: 11,
  },
  bottomBar: {
    flex: 1,
  },
});

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Detail: DetailScreen,
}, {
    initialRouteName: 'Home',
    headerMode: 'none',
  });

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
