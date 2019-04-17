import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet} from 'react-native';

export default class RoutineCard extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <View style={[styles.card, styles.shadow]}>
                <View style={styles.cardTitle}>
                    <Text style={styles.titleText}>
                        {this.props.workout.description}
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

        );
    } 
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        backgroundColor: '#f4f4f4',
        alignItems: 'stretch',           
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowOpacity: .4,
        shadowRadius: 3,
    },
    card: {
        flex: 1,
        width: '90%',
        marginLeft: '5%',
        alignContent: 'stretch',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginTop: 17,
    },
    cardTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 10,
    },
    titleText: {
        flexDirection: 'row',
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
