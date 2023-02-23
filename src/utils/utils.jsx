import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Pressable
} from 'react-native';

const styles = StyleSheet.create({
    scrollArea: {
        height: '100%',
        backgroundColor:'#FFFFFF',
        alignItems: 'center',
        paddingVertical: 15
    },
    card: {
        width: '90%',
        height: 72,
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    taskName: {
        fontWeight: 500,
        fontSize: 14,
        color: 'black'
    },
    taskDuration: {
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 12,
        color: 'black'
    },
    selectedTaskName: {
        fontWeight: 500,
        fontSize: 14,
        color: 'white'
    },
    selectedCard: {
        width: '90%',
        height: 72,
        backgroundColor: '#34c6f3',
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    selectedTaskDuration: {
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 12,
        color: 'white'
    }

  });


export const TaskCard = props => {
    const [userSelection, setUserSelection] = useState(false);
    const updateSelection = () => {
        
        if (props.selectedTask === props.name) {
            props.setSelectedTask("")
        } else {
            props.setSelectedTask(props.name)
        }
        setUserSelection(!userSelection);
    };

    return (
        <Pressable onPress={updateSelection}>

        
            <View style={(props.selectedTask === props.name)? styles.selectedCard : styles.card}>
                <Text style={(props.selectedTask === props.name)? styles.selectedTaskName : styles.taskName}>{props.name}</Text>
                <Text style={(props.selectedTask === props.name)? styles.selectedTaskDuration : styles.taskDuration}>{props.duration} {props.duration == 1 ? "minute" : "minutes"}</Text>
            </View>
        </Pressable>
    )
    
}
