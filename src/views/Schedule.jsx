import React, { useEffect, useState } from 'react';
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

import TaskCard from '../components/TaskCard'
import { useBackend } from '../util/Backend';

const ScheduleView = ({ navigation }) => {
  const { backend }  = useBackend();
  const [selectedTask, setSelectedTask] = useState({name: "", duration: 0});

  // TODO: pull tasks from backend and then display all task cards
  const getTasks = async () => {
    const { data : res } = await backend.get('/tasks');
    return res;
  };

  const TaskCardsList = props => {
    let tasks = getTasks();
    const renderTaskCard  = ({task}) => {
      return (<TaskCard name={task.name} duration={task.duration} setSelectedTask={setSelectedTask} selectedTask={selectedTask}></TaskCard>)
    }
    return
    (<SafeAreaView>
      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={task => task.tid}
      />
    </SafeAreaView>);

  }

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
                console.log(selectedTask)
              }
            }
          }
        />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* TODO: pull tasks from DB  */}
        <TaskCard name="Hang out with Parsa" duration={12} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
        <TaskCard name="Coffee chat" duration={30} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
        <TaskCardsList/>
      </ScrollView>

    </SafeAreaView>
  );
};

export default ScheduleView;
