import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  FlatList
} from 'react-native';

import TaskCard from '../components/TaskCard'
import { useBackend } from '../util/Backend';

const ScheduleView = ({ navigation }) => {
  const { backend }  = useBackend();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({tid: "", name: "", duration: 0});

  // TODO: pull tasks from backend and then display all task cards
  const getTasks = async () => {
    const { data : res } = await backend.get('/tasks');
    setTasks(res);
  };

  useEffect(() => {
    getTasks();
  }, []);

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
              }
            }
          }
        />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {tasks.map(task => <TaskCard name={task.name} duration={task.duration} selectedTask={selectedTask} setSelectedTask={setSelectedTask} tid={task.tid}/>)}
      </ScrollView>

    </SafeAreaView>
  );
};

export default ScheduleView;
