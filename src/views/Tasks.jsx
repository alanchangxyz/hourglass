import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../util/Auth';
import { useBackend } from '../util/Backend';

const styles = StyleSheet.create({
    taskList: {
        minHeight: '100%',
        backgroundColor:'#FFFFFF',
        alignItems: 'center',
        paddingVertical: 15
    },
    taskCard: {
        width: '90%',
        minWidth: 300,
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
        <View style={styles.taskCard}>
            <Text style={styles.taskName}>{props.name}</Text>
            <Text style={styles.taskDuration}>{props.duration} {props.duration == 1 ? "minute" : "minutes"}</Text>
        </View>
    )
}

const TasksView = ({navigation}) => {
  const [taskData, setTaskData] = useState();
  const { backend } = useBackend();
  const { changeUser, currentUser } = useAuth();

  useEffect(() => {
    getTaskData();
  }, [currentUser]);

  useFocusEffect(() => {
    getTaskData()
  });

  async function getTaskData() {
    try {
      const response = await backend.get(`/tasks/by-user/${currentUser.id}`);
      // const response = await fetch(`https://hourglass.alanchang.xyz/api/tasks/by-user/${currentUser.id}`, { method: 'GET'});
      setTaskData(response.data);
    } catch (error) {
      console.log("get");
      console.error(error);
    }
  };

  const renderTaskCard = ({ item }) => (
    <TaskCard
        name={item.name}
        duration={item.duration}
      />
  );

    return (
        <SafeAreaView>
            <StatusBar />
            <Button
              title="Add Task"
              onPress={() =>
                  navigation.navigate("Add a Task")
              }
            />
            <FlatList
              contentContainerStyle={styles.taskList}
              data={taskData}
              renderItem={renderTaskCard}
              keyExtractor={item => item.tid}
            />
        </SafeAreaView>
    );
};

export default TasksView;
