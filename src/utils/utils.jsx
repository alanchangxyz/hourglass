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

export const styles = StyleSheet.create({
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
    const updateSelection = () => {
        if (props.selectedTask.name === props.name) {
            props.setSelectedTask({name: "", duration: 0})
        } else {
            props.setSelectedTask({name: props.name, duration: props.duration})
        }
    };

    return (
        <Pressable onPress={updateSelection}>

        
            <View style={(props.selectedTask.name === props.name)? styles.selectedCard : styles.card}>
                <Text style={(props.selectedTask.name === props.name)? styles.selectedTaskName : styles.taskName}>{props.name}</Text>
                <Text style={(props.selectedTask.name === props.name)? styles.selectedTaskDuration : styles.taskDuration}>{props.duration} {props.duration == 1 ? "minute" : "minutes"}</Text>
            </View>
        </Pressable>
    )
    
}
