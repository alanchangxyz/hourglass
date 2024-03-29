import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, ListChecks, ListDashes, UserCircle } from 'phosphor-react-native';

// Contexts
import { AuthProvider } from './src/util/Auth';
import { BackendProvider } from './src/util/Backend';

// Views
import HomeView from './src/views/Home';
import ScheduleTabNavigator from './src/navigators/ScheduleTab';
import TasksTabNavigator from './src/navigators/TasksTab';
import ProfileView from './src/views/Profile';
import ScheduleView from './src/views/Schedule';

const home = "Home";
const schedule = "Schedule";
const tasks = "Tasks";
const profile = "Profile";

const routeMappings = {
  Home: {
    name: "Home",
    tab: <House />,
    component: HomeView,
  },
  Schedule: {
    name: "Schedule",
    tab: <ListDashes />,
    component: ScheduleTabNavigator,
    options: { headerShown: false },
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
  }
};

// Navigation Tab
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: ['hourglass://'],
  config: {
    initialRouteName: 'Profile',
    screens: {
      Profile: {
        path: 'profile/:email'
      }
    }
  }
};

const App = () => {
  return (
    <BackendProvider>
      <AuthProvider>
        <NavigationContainer
        linking={linking}
        fallback={<ActivityIndicator color="blue" size="large" />}
        >
          <Tab.Navigator
            initialRouteName={home}
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
                {...(routeMappings[r].options ?? {})}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </BackendProvider>
  );
};

export default App;
