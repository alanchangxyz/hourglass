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

import { TaskCard, styles } from '../utils/utils';


const ScheduleView = ({ navigation }) => {
  const [selectedTask, setSelectedTask] = useState({name: "", duration: 0});

  return (
    <SafeAreaView>
      <StatusBar />
      {/* TODO: next button should be fixed at bottom and scroll area should be above that*/}
      <Button
          title="Next"
          onPress={() =>
            {
              if (selectedTask.name !== "") {
                navigation.navigate("Choose a Time Range", selectedTask)
                console.log(selectedTask)
              }
            }
          }
        />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* TODO: pull tasks from DB  */}
        <TaskCard name="Hang out with Parsa" duration={12} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
        <TaskCard name="Coffee chat" duration={30} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
      </ScrollView>
      
    </SafeAreaView>
  );
};

export default ScheduleView;
