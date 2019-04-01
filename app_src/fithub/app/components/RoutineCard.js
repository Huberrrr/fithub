import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet} from 'react-native';

export default class RoutineCard extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <TouchableOpacity 
                onPress={() => this._onWorkoutPress(this.props.workout) }
            >
                <View style={styles.card}>
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleText}>
                            {this.props.workout.name}
                        </Text>
                    </View>
                    <View style={styles.cardBody}>
                        <FlatList
                            scrollEnabled={false}
                            data={this.props.workout.exercises}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item) =>  
                                <View style={styles.cardRow}>
                                    <Text style={styles.exerciseText}>
                                        {item.item.name}
                                    </Text>
                                    <Text style={styles.equipmentTypeText}>
                                        {item.item.equipment_type}
                                    </Text>
                                </View>
                            }
                        /> 
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _onWorkoutPress(workout) {
        //console.log("WORKOUT: ", workout);
        Alert.alert(
            `${workout.name}`,
            `Would you like to add this workout to today's workout?`,
            [
                //Buttons are in the order: (Neutral), Negative, Positive
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    const newWorkout = {
                            name: workout.name, 
                            id: workout.id,
                            exercises: workout.exercises
                    };
                    //console.log(workout.exercises);
                    postWorkout(
                        {
                            token: '',
                            id: '',
                            uid: '',
                            name: workout.name,
                            muscle_groups:[],
                            date: new Date().toJSON().slice(0, 10),
                            description: "Predefined workout",
                            exercises: workout.exercises,
                            public:false,

                            //likes: 0
                        }
                    );
                    }
                },
            ]
        );
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        backgroundColor: '#f4f4f4',
        alignItems: 'stretch',           
    },
    card: {
        flex: 1,
        width: '100%',
        alignContent: 'stretch',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginTop: 17,
    },
    cardTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    titleText: {
        textAlign: 'center',
        fontSize: 40,
        color: '#333',
    },
    cardRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingTop: 5,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    setsList: {
        backgroundColor: '#fff',
    },
    exerciseText: { 
        fontSize: 20,
        color: '#333',
    },
    equipmentTypeText: {
        fontSize: 20,
        color: '#00adf5',
    },
    muscleGroupText: {
        fontSize: 20,
        color: '#333',
    }
});
