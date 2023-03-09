import React from 'react';
import { Text } from 'react-native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {NativeBaseProvider} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Contexts
import { AuthProvider } from './src/util/Auth';
import { BackendProvider } from './src/util/Backend';

// Views
import HomeView from './src/views/Home';
import ScheduleView from './src/views/Schedule';
import TasksView from './src/views/Tasks';
import ProfileView from './src/views/Profile';

const routeMappings = {
  Home: {
    name: "Home",
    tab: <Text>Home Icon</Text>,
    component: HomeView,
  },
  Schedule: {
    name: "Schedule",
    tab: <Text>Schedule Icon</Text>,
    component: ScheduleView,
  },
  Tasks: {
    name: "Tasks",
    tab: <Text>Tasks Icon</Text>,
    component: TasksView,
  },
  Profile: {
    name: "Profile",
    tab: <Text>Profile Icon</Text>,
    component: ProfileView,
  },
};

// Navigation Tab
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <BackendProvider>
      <AuthProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              tabBarIcon: () => routeMappings[route.name].tab
            })}
            >
            {Object.keys(routeMappings).map(r => (
              <Tab.Screen
                key={routeMappings[r].name}
                name={routeMappings[r].name}
                component={routeMappings[r].component}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </BackendProvider>
  );
};

export default App;
