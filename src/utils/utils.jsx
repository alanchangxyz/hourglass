import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';

export const styles = StyleSheet.create({
  scrollArea: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 15,
  },
  card: {
    width: '90%',
    height: 72,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
  },
  taskName: {
    fontWeight: 500,
    fontSize: 14,
    color: 'black',
  },
  taskDuration: {
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 12,
    color: 'black',
  },
  selectedTaskName: {
    fontWeight: 500,
    fontSize: 14,
    color: 'white',
  },
  selectedCard: {
    width: '90%',
    height: 72,
    backgroundColor: '#34c6f3',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
  },
  selectedTaskDuration: {
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 12,
    color: 'white',
  },
  fieldTitle: {
    fontWeight: 400,
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    marginHorizontal: 20,
    padding: 10,
  },
  taskDurationFields: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 30,
  },
  childView: {
    height: 50,
    flexDirection: 'row',
  },
  scheduleCard: {
    width: '90%',
    height: 60,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
  },
  selectedCard: {
    width: '90%',
    height: 60,
    backgroundColor: '#34c6f3',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
  },
  validButton: {
    alignSelf: 'center',
  },
});

export const TaskCard = props => {
  const updateSelection = () => {
    if (props.selectedTask.name === props.name) {
      props.setSelectedTask({ name: '', duration: 0 });
    } else {
      props.setSelectedTask({ name: props.name, duration: props.duration });
    }
  };

  return (
    <Pressable onPress={updateSelection}>
      <View style={props.selectedTask.name === props.name ? styles.selectedCard : styles.card}>
        <Text
          style={
            props.selectedTask.name === props.name ? styles.selectedTaskName : styles.taskName
          }>
          {props.name}
        </Text>
        <Text
          style={
            props.selectedTask.name === props.name
              ? styles.selectedTaskDuration
              : styles.taskDuration
          }>
          {props.duration} {props.duration == 1 ? 'minute' : 'minutes'}
        </Text>
      </View>
    </Pressable>
  );
};

export const ScheduleCard = props => {
  const updateSelection = () => {
    if (props.selectedTime.startTime !== props.time.startTime) {
      props.setSelectedTime(props.time);
    }
  };

  return (
    <Pressable onPress={updateSelection}>
      <View
        style={
          props.selectedTime.startTime === props.time.startTime
            ? styles.selectedCard
            : styles.scheduleCard
        }>
        <Text
          style={
            props.selectedTime.startTime === props.time.startTime
              ? styles.selectedTaskName
              : styles.taskName
          }>
          {convertMilitaryTime(props.time.startTime)} - {convertMilitaryTime(props.time.endTime)}
        </Text>
      </View>
    </Pressable>
  );
};

export function convertMilitaryTime(time) {
  time = time.split(':');
  var hour = time[0];
  var minute = time[1];
  var ampm;
  hour = parseInt(hour);
  if (hour >= 12) {
    if (hour > 12) {
      hour %= 12;
    }
    ampm = ' PM';
  } else {
    if (hour == 0) {
      hour = 12;
    }
    ampm = ' AM';
  }
  return hour.toString() + ':' + minute.toString() + ampm;
}
