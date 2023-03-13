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
import DatePicker from 'react-native-date-picker';

import {styles, parseDate, parseTime} from '../utils/utils'

const ScheduleTimeRangeView = ({navigation, route}) => {
    const {name, duration, tid} = route.params
    console.log(name)
    const [timeRangeStart, setTimeRangeStart] = useState(new Date())
    const [timeRangeEnd, setTimeRangeEnd] = useState(new Date())
    const [date, setDate] = useState(new Date())

    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollArea}>
                <Text style={styles.fieldTitle}>When would you like this task to be scheduled? </Text>
                <Text>Date</Text>
                <DatePicker date={date} onDateChange={setDate} mode="date"></DatePicker>
                <View style={styles.timeSelectorContainer}>
                    <View>
                        <Text style={styles.timeSelectorTitle}>As early as:</Text>
                        <DatePicker date={timeRangeStart} onDateChange={setTimeRangeStart} mode="time" />
                    </View>
                    <View>
                        <Text style={styles.timeSelectorTitle}>As late as: </Text>   
                        <DatePicker date={timeRangeEnd} onDateChange={setTimeRangeEnd} mode="time" />
                    </View>
                </View>
                
                <Button
                    title="Next"
                    onPress={() =>
                        navigation.navigate("Choose a Time Slot", {taskName: name, taskDuration: duration, tid:tid,
                            date: parseDate(date.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"})),
                            timeRangeStart: parseTime(timeRangeStart.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})), 
                            timeRangeEnd: parseTime(timeRangeEnd.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}))})
                    }
                />
                
            </ScrollView>
            
            
        </SafeAreaView>
    );
};

export default ScheduleTimeRangeView;
