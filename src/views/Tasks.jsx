import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';

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

  async function getTaskData() {
    try {
      const response = await fetch(`https://hourglass.alanchang.xyz/api/tasks`);
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson;
    } catch (error) {
      console.error(error);
      // return DATA;
    }
  };

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
  useEffect(() => {
    getTaskData().then(data => setTaskData(data));
  }, []);

  const renderTaskCard = ({ item }) => {
    console.log(item);
    return (
      <TaskCard
        name={item.name}
        duration={item.duration}
      />
    )
    };

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
