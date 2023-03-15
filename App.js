import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, ListChecks, ListDashes, UserCircle } from 'phosphor-react-native';

// Contexts
import { AuthProvider } from './src/util/Auth';
import { BackendProvider } from './src/util/Backend';

// Views
import HomeView from './src/views/Home';
import ScheduleView from './src/views/Schedule';
import TasksTabNavigator from './src/navigators/TasksTab';
import ProfileView from './src/views/Profile';

const routeMappings = {
  Home: {
    name: "Home",
    tab: <House />,
    component: HomeView,
  },
  Schedule: {
    name: "Schedule",
    tab: <ListDashes />,
    component: ScheduleView,
  },
  Tasks: {
    name: "Tasks",
    tab: <ListChecks />,
    component: TasksTabNavigator,
  },
  Profile: {
    name: "Profile",
    tab: <UserCircle />,
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
            backBehavior="order"
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
