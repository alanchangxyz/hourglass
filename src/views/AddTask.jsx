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

import { useAuth } from '../util/Auth';
import { useBackend } from '../util/Backend';


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
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 30,
  },
});

const TaskNameField = ({ setTaskName }) => {
  return (
    <View>
      <Text style={styles.fieldTitle}>Task Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Task Name"
        onChangeText={setTaskName}
      />
    </View>
  );
};

const TaskDurationField = ({ setTaskHours, setTaskMins }) => {
  return (
    <View>
      <Text style={styles.fieldTitle}>Task Duration</Text>
      <View style={styles.taskDurationFields}>
        <TextInput
          style={styles.textInput}
          placeholder="Hours"
          onChangeText={setTaskHours}
          inputMode="numeric"
        />
        <Text>Hours</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Mins"
          onChangeText={setTaskMins}
          inputMode="numeric"
        />
        <Text>Minutes</Text>
      </View>

    </View>
  );
};

const AddTaskView = ({ navigation, route }) => {
  const [taskName, setTaskName] = useState("");
  const [taskHours, setTaskHours] = useState("0");
  const [taskMins, setTaskMins] = useState("0");

  const { backend } = useBackend();
  const { changeUser, currentUser } = useAuth();

  async function createTask(taskName, taskHours, taskMins) {
    try {
      taskDuration = Number(taskHours) * 60 + Number(taskMins);

      const response = await backend.post('/tasks', {
        uid: currentUser.id,
        name: taskName,
        duration: taskDuration
      });
    } catch (error) {
      console.error(error);
    }

    navigation.navigate("Your Tasks");
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <TaskNameField setTaskName={setTaskName} />
        <TaskDurationField setTaskHours={setTaskHours} setTaskMins={setTaskMins} />
        <Button
          title="Create Task"
          onPress={() => createTask(taskName, taskHours, taskMins)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTaskView;
