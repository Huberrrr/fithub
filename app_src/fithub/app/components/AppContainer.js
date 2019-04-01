import React from 'React';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

import AddWorkoutScreen from '../screens/AddWorkout';
import LoggerScreen from '../screens/Logger';
import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/Feed';
import ProfileScreen from '../screens/Profile';
import CreateExercisesScreen from '../screens/CreateExercises';
import CreateWorkoutScreen from '../screens/CreateWorkout';
import DetailScreen from '../screens/Detail';
import SelectExercisesScreen from '../screens/SelectExercises';
import SettingsScreen from '../screens/Settings';
import WorkoutLogEditScreen from '../screens/WorkoutLogEdit'
import SearchScreen from '../screens/Search';
import SelectWorkoutScreen from '../screens/SelectWorkout';
import DefaultWorkoutsScreen from '../screens/DefaultWorkouts';
import CustomWorkoutsScreen from '../screens/CustomWorkouts';


const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null
    }
  },
  Details: DetailScreen,
  DetailsEdit: WorkoutLogEditScreen
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
  },
  Settings: SettingsScreen
});

const LoggerStack = createStackNavigator({
  Logger: {
    screen: LoggerScreen,
  },
  SelectExercises: SelectExercisesScreen
});

const WorkoutTabs = createMaterialTopTabNavigator(
  {
    CustomWorkouts: {
      screen: CustomWorkoutsScreen,
      navigationOptions: {
        title: 'Custom',
      }
    },
    DefaultWorkouts: {
      screen: DefaultWorkoutsScreen,
      navigationOptions: {
        title: 'Default',
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#00adf5',
      },

    },
  }
)

const WorkoutStack = createStackNavigator(
{
  AddWorkout: {
    screen: WorkoutTabs,
  },
  CreateWorkout: {
    screen: CreateWorkoutScreen,
  },
},
{
  defaultNavigationOptions: ({navigation}) => { 
    return {
    title: 'Workouts',
    headerRight: <Icon name="add" type="material" size={35} onPress={() => { navigation.push('CreateWorkout')} } />
    }
  }
},
);

const FeedStack = createStackNavigator({
  Feed: {
    screen: FeedScreen, 
    navigationOptions: {
      header: null,
    }
  },
  Search: SearchScreen,
  Profile: ProfileScreen
});

const AppContainer = createAppContainer(createBottomTabNavigator(
  {
    Logger: {
      screen: LoggerStack,
      navigationOptions: {
        tabBarIcon: <Icon name="add" type="material" size={35} />
      }
    },
    Workouts: {
      screen: WorkoutStack,
      navigationOptions: {
        tabBarIcon: <Icon name="book" type="material" size={35} />
      }
    },
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: <Icon name="home" type="material" size={35} />
      }
    },
    Feed: {
      screen: FeedStack,
      navigationOptions: {
        tabBarIcon: <Icon name="language" type="material" size={35} />
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: <Icon name="person" type="material" size={35} />
      }
    },
  },
  {
    tabBarOptions: {
      style: {
        height: 55,
      },
      activeTintColor: '#00adf5',
    },
    initialRouteName: 'Home'
  }
));

export default AppContainer;
