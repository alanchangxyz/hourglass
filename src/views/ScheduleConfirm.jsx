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

import { styles, convertMilitaryTime } from '../utils/utils';

const ScheduleConfirmView = ({ navigation, route }) => {
  console.log(route.params);

  const { selectedStartTime, selectedEndTime, taskName, taskDuration } = route.params;

  const addConfirmedTasktoDB = () => {
    // TODO: ADD TO DATABASE
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollArea}>
        <Text style={styles.fieldTitle}> Your task has been currently scheduled for: </Text>
        <Text style={styles.fieldTitle}>
          {' '}
          {convertMilitaryTime(selectedStartTime)} - {convertMilitaryTime(selectedEndTime)}
        </Text>
        <Text style={styles.fieldTitle}>
          {' '}
          Would you like to add this event to your Google Calendar?{' '}
        </Text>
        <View style={styles.childView}>
          <Button title="Later" onPress={addConfirmedTasktoDB} style={styles.validButton} />
          <Button title="Yes" onPress={addConfirmedTasktoDB} style={styles.validButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleConfirmView;
