import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput
} from 'react-native';

const AddTaskView = ({navigation}) => {
    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Text>Task Name</Text>
                <TextInput placeholder="Task Name"/>
                <Text>Task Duration</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddTaskView;