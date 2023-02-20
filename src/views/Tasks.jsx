import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button
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
    }
  });

const TaskCard = props => {
    return (
        <View style={styles.card}>
            <Text style={styles.taskName}>{props.name}</Text>
            <Text style={styles.taskDuration}>{props.duration} {props.duration == 1 ? "minute" : "minutes"}</Text>
        </View>
    )
}

const TasksView = ({navigation}) => {
    return (
        <SafeAreaView>
            <StatusBar />
            <Button 
                title="Add Task"
                onPress={() =>
                    navigation.navigate("Add a Task")
                }
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollArea}>
                <TaskCard name="Hang out with Parsa" duration={12}/>
                <TaskCard name="Your mom" duration={1}/>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TasksView;