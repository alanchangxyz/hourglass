import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Button } from 'react-native';

import TaskCard from '../components/TaskCard';
import { useBackend } from '../util/Backend';
import { useAuth } from '../util/Auth';
import { useFocusEffect } from '@react-navigation/native';

const ScheduleView = ({ navigation }) => {
  const { backend } = useBackend();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({ tid: '', name: '', duration: 0 });
  const { currentUser } = useAuth();

  // TODO: pull tasks from backend and then display all task cards
  const getTasks = async () => {
    const { data: res } = await backend.get(`/tasks/by-user/${currentUser.id}`);
    setTasks(res);
  };

  useEffect(() => {
    getTasks();
  }, [currentUser]);

  useFocusEffect(() => {
    getTasks();
  })

  return (
    <SafeAreaView>
      <StatusBar />
      {/* TODO: next button should be fixed at bottom and scroll area should be above that*/}
      <Button
        title="Next"
        onPress={() => {
          if (selectedTask.name !== '') {
            navigation.navigate('Choose a Time Range', {tid: selectedTask.time, name:selectedTask.name, duration: selectedTask.duration, uid: currentUser.id});
          }
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {tasks?.map(task => (
          <TaskCard
            name={task.name}
            duration={task.duration}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            tid={task.tid}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleView;
