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


const styles = StyleSheet.create({
    fieldTitle: {
        fontWeight: 400,
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 15,
        color: 'black'
    },
    textInput: {
        borderWidth: 1,
        marginHorizontal: 20,
        padding: 10
    },
    taskDurationFields: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 30,
    },
});

const TaskNameField = () => {
    const [taskName, setTaskName] = useState("");
    return (
        <View>
            <Text style={styles.fieldTitle}>Task Name</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder="Task Name"
                onChangeText={newText => setTaskName(newText)}
                defaultValue={taskName}
            />
        </View>
    );
};

const TaskDurationField = () => {
    const [taskHours, setTaskHours] = useState("0");
    const [taskMins, setTaskMins] = useState("0");
    return (
        <View>
            <Text style={styles.fieldTitle}>Task Duration</Text>
            <View style={styles.taskDurationFields}>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Hours"
                    onChangeText={newText => setTaskHours(newText)}
                    defaultValue={taskHours}
                    inputMode="numeric"
                />
                <Text>Hours</Text>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Minutes"
                    onChangeText={newText => setTaskMins(newText)}
                    defaultValue={taskMins}
                    inputMode="numeric"
                />
                <Text>Minutes</Text>
            </View>
            
        </View>
    );
};

const AddTaskView = ({navigation, route}) => {
    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <TaskNameField />
                <TaskDurationField />
                <Button title="Add Task"/>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddTaskView;