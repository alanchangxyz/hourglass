import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

// Views
import HomeView from './src/views/Home';
import ScheduleView from './src/views/Schedule';
import TasksView from './src/views/Tasks';
import ProfileView from './src/views/Profile';

//View names
const home = "Home";
const schedule = "Schedule";
const tasks = "Tasks";
const profile = "Profile";

// Navigation Tab
const Tab = createBottomTabNavigator();

function NavigationBar() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={home}
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            if (route.name === home) {
              return <Text>Home Icon</Text>;
            }
            else if (route.name === schedule) {
              return <Text>Schedule Icon</Text>
            }
            else if (route.name === tasks) {
              return <Text>Tasks Icon</Text>
            }
            else if (route.name === profile) {
              return <Text>Profile Icon</Text>;
            }
          },
        })}
        >

        <Tab.Screen name={home} component={HomeView} />
        <Tab.Screen name={schedule} component={ScheduleView} />
        <Tab.Screen name={tasks} component={TasksView} />
        <Tab.Screen name={profile} component={ProfileView} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (<NavigationBar/>);
};

export default App;
