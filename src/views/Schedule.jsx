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
  
  const [selectedTask, setSelectedTask] = useState({name: "", duration: 0});

  // TODO: pull tasks from backend and then display all task cards
  async function getTasks() {
    const {backend}  = useBackend();
    try {
      const response = await fetch('https://hourglass.alanchang.xyz/api/tasks')
      // const response = await backend.get('/tasks')
      const responseData = response.body
      console.log(responseData)
      return responseData;
    } catch (error) {
      console.log(error.response.data)
    }
    return [];
    
  }
  
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
