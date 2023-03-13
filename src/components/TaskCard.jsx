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
import {styles} from "../utils/utils"

export default TaskCard = props => {
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