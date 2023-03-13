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

import { useAuth } from '../util/Auth';
import { useBackend } from '../util/Backend';

const styles = StyleSheet.create({
    taskList: {
        height: '100%',
        backgroundColor:'#FFFFFF',
        alignItems: 'center',
        paddingVertical: 15
    },
    taskCard: {
        width: '90%',
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
    getTaskData().then(data => setTaskData(data));
  });

  async function getTaskData() {
    try {
      const response = await backend.get(`/tasks/by-user/${currentUser.id}`);
      const responseData = response.data;
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error(error);
      // return DATA;
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
              keyExtractor={item => item.tid} />
        </SafeAreaView>
    );
};

export default TasksView;
