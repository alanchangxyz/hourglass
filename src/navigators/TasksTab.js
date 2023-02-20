import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TasksView from "../views/Tasks";
import AddTaskView from "../views/AddTask";

const Stack = createNativeStackNavigator();

const tasks = "Your Tasks";
const addTask = "Add a Task";

const TasksTabNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={tasks} component={TasksView}/>
            <Stack.Screen name={addTask} component={AddTaskView}/>
        </Stack.Navigator>
    )
}

export default TasksTabNavigator;