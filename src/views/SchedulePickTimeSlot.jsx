import React, { useState, useEffect } from 'react';
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

import {  styles, convertMilitaryTime} from '../utils/utils'
import { ScheduleCard } from '../components/ScheduleCard';


const SchedulePickTimeSlotView = ({navigation, route}) => {
    console.log('Route params', route.params)

    const rankedRecommendations = route.params;
    console.log(rankedRecommendations)
    const [selectedTime, setSelectedTime] = useState(rankedRecommendations[0])

    // const ranked_recommendations = [{startTime: "11:00:00", endTime: "11:30:00"}, 
    //                           {startTime: "11:15:00", endTime: "11:45:00"},
    //                           {startTime: "11:30:00", endTime: "12:00:00"},
    //                           {startTime: "13:00:00", endTime: "13:30:00"},
    //                           {startTime: "13:15:00", endTime: "13:45:00"}]

    
    const [page, setPage] = useState(1)

    const confirmation = () => {
        rankedRecommendations.forEach( (rec) => {
            if (rec.startTime !== selectedTime.startTime) {
                // post recommendation to database
                console.log()
            } 
            navigation.navigate("Your Task Has Been Scheduled", {selectedStartTime: selectedTime.startTime, selectedEndTime: selectedTime.endTime, taskName: taskName, taskDuration: taskDuration})
        })
    }

    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollArea}>
            <Text style={styles.fieldTitle}> Your task is currently scheduled for: </Text>
            <Text style={styles.fieldTitle}> {convertMilitaryTime(selectedTime?.startTime)} - {convertMilitaryTime(selectedTime?.endTime)}</Text>
            <View style={styles.childView}> 
                <Button title="See prev recs" onPress={() => (page !== 1 )? setPage(page - 1): setPage(page)} style={styles.validButton}/>
                <Button title="See more recs" onPress={() => (page % 3 != 0 && page !== Math.trunc(rankedRecommendations.length /3) + 1) ? setPage(page + 1): setPage(page)} style={styles.validButton}/>
            </View>
            
                {rankedRecommendations.slice((page - 1) * 3, page * 3).map((rec) => <ScheduleCard time={rec} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>)}

                <Button
                    title="Confirm Time"
                    onPress={confirmation}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SchedulePickTimeSlotView;
