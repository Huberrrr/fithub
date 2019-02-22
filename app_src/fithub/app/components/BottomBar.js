import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import { Icon } from 'react-native-elements';



export default class BottomBar extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.barContainer}>
        {/* go to DetailScreen */}
        <Icon
          name="book"
          type="material-community"
          size={35}
          onPress={() => this.props.navigation.navigate('Details')}
        />
        {/* go to AddWorkoutScreen */}
        <Icon
          name="plus"
          type="entypo"
          size={35}
          onPress={() => this.props.navigation.navigate('AddWorkout')}
        />
        {/* go to HomeScreen */}
        <Icon
          name="home"
          type="material-community"
          size={35}
          onPress={() => this.props.navigation.navigate('Home')}
        />
        {/* go to FeedScreen */}
        <Icon
          name="globe"
          type="entypo"
          size={35}
          onPress={() => this.props.navigation.navigate('Feed')}
        />
        {/* go to ProfileScreen */}
        <Icon
          name="account"
          type="material-community"
          size={35}
          onPress={() => this.props.navigation.navigate('Profile')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 20,
    backgroundColor: '#fff',
  }
});
