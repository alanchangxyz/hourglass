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
import { useBackend } from '../util/Backend';
import {styles, parseDate, parseTime} from '../utils/utils'

const ScheduleTimeRangeView = ({navigation, route}) => {
    const {name, duration, tid} = route.params
    console.log(name)
    const [timeRangeStart, setTimeRangeStart] = useState(new Date())
    const [timeRangeEnd, setTimeRangeEnd] = useState(new Date())
    const [date, setDate] = useState(new Date())
    const [rankedRecommendations, setRankedRecommendations] = useState([]);
    const { backend }  = useBackend();

    const getRecommendations = async () => {
        console.log("RECOMMENDATIONS");
        var parsedDate = parseDate(date.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"}));
        var parsedTimeRangeStart = parseTime(timeRangeStart.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        var parsedTimeRangeEnd = parseTime(timeRangeEnd.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        console.log(`/recommendations/generate/${tid}/${date}/${timeRangeStart}/${timeRangeEnd}`);
        const res = await backend.get(`/recommendations/generate/${tid}/${parsedDate}/${parsedTimeRangeStart}/${parsedTimeRangeEnd}`);
        console.log('data is', res.data);
        setRankedRecommendations(res.data); 
    };

    const sendRecommendationsToNextScreen = async () => {
        console.log("getting recommendations");
        await getRecommendations();
        navigation.navigate("Choose a Time Slot", rankedRecommendations)
    }

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
                        await sendRecommendationsToNextScreen()
                    }
                />
                
            </ScrollView>
            
            
        </SafeAreaView>
    );
};

export default ScheduleTimeRangeView;
