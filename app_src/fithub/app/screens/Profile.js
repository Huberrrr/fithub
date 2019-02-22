import React from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    StatusBar,
    Platform
} from 'react-native';
import BottomBar from '../components/BottomBar';
import { Icon } from 'react-native-elements';

class ProfileScreen extends React.Component {
    constructor(props){
        super(props);
      }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.text}> 
                    <Text>Profile Screen</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBar: {
      justifyContent: 'flex-end',
    },
  });

export default ProfileScreen;
