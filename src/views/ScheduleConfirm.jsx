import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View, Button } from 'react-native';

import { styles, convertMilitaryTime, parseDate } from '../utils/utils';
import { useBackend } from '../util/Backend';
import { useAuth } from '../util/Auth';

const ScheduleConfirmView = ({ navigation, route }) => {
  const { backend } = useBackend();

  const { date, selectedStartTime, selectedEndTime, tid, uid } = route.params;

  const confirmWithGCal = async () => {
    await postRecommendation(true);
    addConfirmedTasktoGCal();
    navigation.navigate('Home');
  };

  const confirmWithOutGCal = async () => {
    await postRecommendation(false);
    navigation.navigate('Home');
  };

  const addConfirmedTasktoGCal = () => {
    // TODO: add to gcal
  };

  const postRecommendation = async added_to_cal => {
    var data = {
      uid: uid,
      tid: tid,
      added_to_cal: added_to_cal,
      chosen: true,
      min_offset: 0,
      start_time: `${parseDate(date, false)} ${selectedStartTime}`,
      end_time: `${parseDate(date, false)} ${selectedEndTime}`,
    };
    try {
      const response = await backend.post(`/recommendations`, data);
    } catch (error) {
      console.error('error: ' + error);
    }
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
          <Button title="Later" onPress={confirmWithOutGCal} style={styles.validButton} />
          <Button title="Yes" onPress={confirmWithGCal} style={styles.validButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleConfirmView;
