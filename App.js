import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, ListChecks, ListDashes, UserCircle } from 'phosphor-react-native';

// Contexts
import { AuthProvider } from './src/util/Auth';
import { BackendProvider } from './src/util/Backend';

// Views
import HomeView from './src/views/Home';
import ScheduleTabNavigator from './src/navigators/ScheduleTab';
import TasksView from './src/views/Tasks';
import ProfileView from './src/views/Profile';

<<<<<<< HEAD
//View names
const home = "Home";
const schedule = "Schedule a Task";
const tasks = "Tasks";
const profile = "Profile";
=======
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
    component: TasksView,
  },
  Profile: {
    name: "Profile",
    tab: <UserCircle />,
    component: ProfileView,
  },
};
>>>>>>> master

// Navigation Tab
const Tab = createBottomTabNavigator();

<<<<<<< HEAD
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
        <Tab.Screen name={schedule} component={ScheduleTabNavigator} options={{headerShown: false}}/>
        <Tab.Screen name={tasks} component={TasksView} />
        <Tab.Screen name={profile} component={ProfileView} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

=======
>>>>>>> master
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
