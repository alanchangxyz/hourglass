import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

// const styles = StyleSheet.create({});

const ScheduleView = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Button
          title="Next"
          onPress={() =>
            navigation.navigate("Choose a Time Range")
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleView;
