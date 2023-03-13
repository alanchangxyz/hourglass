import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import { styles } from '../utils/utils';

const ScheduleTimeRangeView = ({ navigation, route }) => {
  const { name, duration } = route.params;
  console.log(name);
  const [timeRangeStart, setTimeRangeStart] = useState(new Date());
  const [timeRangeEnd, setTimeRangeEnd] = useState(new Date());

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollArea}>
        <Text style={styles.fieldTitle}>When would you like this task to be scheduled? </Text>
        <Text>As early as:</Text>
        <DatePicker date={timeRangeStart} onDateChange={setTimeRangeStart} mode="time" />
        <Text>As late as: </Text>
        <DatePicker date={timeRangeEnd} onDateChange={setTimeRangeEnd} mode="time" />

        <Button
          title="Next"
          onPress={() =>
            navigation.navigate('Choose a Time Slot', {
              taskName: name,
              taskDuration: duration,
              timeRangeStart: timeRangeStart.toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
              }),
              timeRangeEnd: timeRangeEnd.toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
              }),
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleTimeRangeView;
