import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import { TaskCard } from '../utils/utils';

// const styles = StyleSheet.create({});


const ScheduleView = ({ navigation }) => {
  const [selectedTask, setSelectedTask] = useState("");

  return (
    <SafeAreaView>
      <StatusBar />
      <Button
          title="Next"
          onPress={() =>
            // navigation.navigate("Choose a Time Range")
            console.log(selectedTask)
          }
        />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* TODO: pull tasks from DB  */}
        <TaskCard name="Hang out with Parsa" duration={12} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
        <TaskCard name="Your mom" duration={1} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
      </ScrollView>
      
    </SafeAreaView>
  );
};

export default ScheduleView;
