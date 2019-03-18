import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  TouchableWithoutFeedbackBase,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { getUserID } from '../lib/AccountFunctions';
import { getProfileStats, getProfileActivity } from '../lib/ProfileFunctions';
import { ContributionGraph } from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2 // optional, default 3
}
const screenWidth = Dimensions.get('window').width

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profile',
      headerRight: <Icon name="settings" type="material" size={30} onPress={() => { navigation.push('Settings') }} />
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      photo: '',
      activityInfo: [],
      dates:[],
      volume: 0,
      bench: 0,
    }
    const didFocusListener = this.props.navigation.addListener(
      'didFocus',
      () => {
        this.loadUserData();
        this.loadUserStats();
      }
    );
    this.loadWorkoutActivity();
  }

  render() {
    if (Platform.OS === 'ios') {
      return (
        <SafeAreaView style={styles.containerIOS}>

          <View style={styles.header}>
            <View style={styles.profPicCol}>
              <Image
                style={styles.profPic}
                source={{ uri: this.state.photo }}
              />
            </View>
            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {this.state.name}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statsCol}>
                  <Text style={styles.stats}>Volume:</Text>
                  <Text style={styles.stats}>{this.state.volume}</Text>
                </View>
                <View style={styles.statsCol}>
                  <Text style={styles.stats}>Bench:</Text>
                  <Text style={styles.stats}>{this.state.bench}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            <Swiper activeDotColor='#00adf5' loop={false}>
              <View style={styles.subContainer}>
                <ScrollView stickyHeaderIndices={[0]}>
                  <View style={styles.subHeaderContainer}><Text style={styles.subHeader}>Activity</Text></View>
                  <Activity />

                </ScrollView>
              </View>
              <View>
                <ScrollView>
                  <View style={styles.subHeaderContainer}><Text style={styles.subHeader}>Workouts</Text></View>
                  <ContributionGraph
                    style={{borderBottomWidth:1}}
                    values={this.state.dates}
                    endDate={new Date('2019-06-01')}
                    numDays={105}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                  />
                  <ActivityCard
                    data={this.state.activityInfo}
                  />
                  <Text>{this.state.activityInfo.length}</Text>
                </ScrollView>
              </View>
            </Swiper>
          </View>

        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.containerAND}>
          <Text>PROFILE</Text>
        </View>
      );
    }
  }
  
  loadUserStats() {
    // let stats = await getProfileStats();
    let stats = {
      maxes: {"Bench Press":135},
      volumes: {"Bench Press":2370,"Squat":2370},
    }
    let totalVolume = 0;
    let maxBench = stats.maxes["Bench Press"] === undefined ? 0 : stats.maxes["Bench Press"];
   
    for(let key in stats.volumes) {
      totalVolume += stats.volumes[key];
    }

    this.setState({
      volume: totalVolume,
      bench: maxBench
    });
  }

  async loadUserData() {
    let userFullName = "";
    let userPhotoUrl = "";
    let id = await getUserID();

    fetch('https://fithub-server.herokuapp.com/profile/' + id)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        userFullName = data.name;
        userPhotoUrl = data.avatar.substring(0, data.avatar.length - 7);

        this.setState({
          name: userFullName,
          photo: userPhotoUrl
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async loadWorkoutActivity() {
    let id = await getUserID();

    fetch('https://fithub-server.herokuapp.com/logs/' + id)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let info = [];
        let dates = [];
        data.logs.map((val, index) => {
          info.push({ name: val.name, date: val.date.slice(0, 10) });
          dates.push({date:val.date.slice(0,10), count: 3})
        });
        this.setState({ activityInfo: info });
        this.setState({ dates: dates });
      })
      .catch((err) => {
        console.log(err);
      });
  }

}

class Activity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      algoData: this.loadActivities()
    }
  }

  render() {
    let activities = [];

    for (let i = 0; i < this.state.algoData.length; i++) {
      activities.push(
        <View style={styles.record} key={i}>
          <Icon name={this.state.algoData[i].icon} type="material" size={30} />
          <Text style={styles.recordText}>
            {this.state.algoData[i].text}
          </Text>
        </View>
      );
    }

    return activities;
  }

  loadActivities() {
    // let activities = await getProfileActivities();
    let activities = [
      "FitHub Tester 307 has achieved a new max of 135",
      "Short Name worked out on 3-1-19!",
    ];
    let parsedActivities = [];

    for(let i = 0; i < activities.length; i++) {
      let icon = "";
      if(activities[i].includes("new max of")) {
        icon = "star";
      } else if(activities[i].includes("worked out on")) {
        icon = "today";
      } else {
        icon = "error";
      }

      parsedActivities[i] = { text: activities[i], icon: icon }
    }

    return parsedActivities;
  }
}

class ActivityCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activityInfo: []

    }
  }
  render() {
    let aCards = []
    for (let x = 0; x < this.props.data.length; x++) {
      aCards.push(
        <TouchableOpacity
          key={x}
          onPress={() => {/*do something here later*/ }}
        >
          <View style={styles.record}>
            <Icon name="flash-outline" type="material-community" size={30} />
            <Text style={styles.recordText}>
              {this.props.data[x].name} - {this.props.data[x].date}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }


    return aCards;
  }


}


const styles = StyleSheet.create({
  containerIOS: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
  },
  containerAND: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#eee',
  },
  profPicCol: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    flex: 4,
  },
  nameRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  statsCol: {
    flex: 1,
    alignItems: 'center',
  },
  body: {
    flexDirection: 'row',
    flex: 3,
    backgroundColor: '#fff',
  },
  profPic: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  name: {
    color: '#333',
    fontSize: 36,
    fontWeight: 'bold',
  },
  stats: {
    color: '#333',
    fontSize: 20,
  },
  subContainer: {
    flex: 1,
  },
  subHeaderContainer: {
    borderBottomWidth: 1,
  },
  subHeader: {
    fontSize: 28,
    backgroundColor: '#fff',
    color: '#333',
    fontWeight: 'bold',
    padding: 20,
  },
  record: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  recordText: {
    color: '#333',
    fontSize: 24,
    paddingLeft: 20,
  },
  card: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 17,
  },
});
