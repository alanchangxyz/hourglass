import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    Button,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useBackend } from '../util/Backend';
import {styles, parseDate, parseTime} from '../utils/utils'

const ScheduleTimeRangeView = ({navigation, route}) => {
    const {tid} = route.params

    const [timeRangeStart, setTimeRangeStart] = useState(new Date())
    const [timeRangeEnd, setTimeRangeEnd] = useState(new Date())

    const [date, setDate] = useState(new Date())
    const { backend }  = useBackend();

    const getRecommendations = async () => {
        
        var parsedDate = parseDate(date.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"}));
        var parsedTimeRangeStart = parseTime(timeRangeStart.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        var parsedTimeRangeEnd = parseTime(timeRangeEnd.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        
        const res = await backend.get(`/recommendations/generate/${tid}/${parsedDate}/${parsedTimeRangeStart}/${parsedTimeRangeEnd}`);
        
        navigation.navigate('Choose a Time Slot', res.data)
    };

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
                    onPress={async() =>
                        await getRecommendations()
                    }
                />
                
            </ScrollView>
            
            
        </SafeAreaView>
    );
};

export default ScheduleTimeRangeView;
