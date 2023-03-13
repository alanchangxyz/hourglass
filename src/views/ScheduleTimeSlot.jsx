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

import { ScheduleCard, styles, convertMilitaryTime } from '../utils/utils';

const SchedulePickTimeSlotView = ({ navigation, route }) => {
  console.log(route.params);

  const { taskName, taskDuration, timeRangeStart, timeRangeEnd } = route.params;
  // send stuff to backend to create recommendations
  // retrieve recommendations from backend

  const ranked_recommendations = [
    { startTime: '11:00:00', endTime: '11:30:00' },
    { startTime: '11:15:00', endTime: '11:45:00' },
    { startTime: '11:30:00', endTime: '12:00:00' },
    { startTime: '13:00:00', endTime: '13:30:00' },
    { startTime: '13:15:00', endTime: '13:45:00' },
  ];

  const [selectedTime, setSelectedTime] = useState(ranked_recommendations[0]);
  const [page, setPage] = useState(1);

  const RecommendationCards = () => {
    return ranked_recommendations
      .slice((page - 1) * 4, page * 4)
      .map(rec => (
        <ScheduleCard time={rec} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      ));
  };

  const confirmation = () => {
    ranked_recommendations.forEach(rec => {
      if (rec.startTime !== selectedTime.startTime) {
        // post recommendation to database
        console.log();
      }
      navigation.navigate('Your Task Has Been Scheduled', {
        selectedStartTime: selectedTime.startTime,
        selectedEndTime: selectedTime.endTime,
        taskName: taskName,
        taskDuration: taskDuration,
      });
    });
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollArea}>
        <Text style={styles.fieldTitle}> Your task is currently scheduled for: </Text>
        <Text style={styles.fieldTitle}>
          {' '}
          {convertMilitaryTime(selectedTime.startTime)} -{' '}
          {convertMilitaryTime(selectedTime.endTime)}
        </Text>
        <View style={styles.childView}>
          <Button
            title="See prev recs"
            onPress={() => (page !== 1 ? setPage(page - 1) : setPage(page))}
            style={styles.validButton}
          />
          <Button
            title="See more recs"
            onPress={() =>
              page !== Math.trunc(ranked_recommendations.length / 4) + 1
                ? setPage(page + 1)
                : setPage(page)
            }
            style={styles.validButton}
          />
        </View>

        <RecommendationCards />

        <Button title="Confirm Time" onPress={confirmation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SchedulePickTimeSlotView;
