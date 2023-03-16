import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    Button,
} from 'react-native';

import {  styles, convertMilitaryTime, parseDate} from '../utils/utils'
import { useBackend } from '../util/Backend';
import { useAuth } from '../util/Auth';
import { ScheduleCard } from '../components/ScheduleCard';


const SchedulePickTimeSlotView = ({navigation, route}) => {
    
    const {rankedRecommendations, tid, date} = route.params;
    
    const [selectedTime, setSelectedTime] = useState(rankedRecommendations[0])
    
    const [page, setPage] = useState(1)

    const { currentUser } = useAuth();
    const { backend } = useBackend(); 

    const confirmation = async () => {
        rankedRecommendations.forEach( async (rec) => {
            if (rec.startTime !== selectedTime.startTime) {
                // post recommendation to database
                await postRecommendation(rec);  
            } 
            navigation.navigate("Your Task Has Been Scheduled", {selectedStartTime: selectedTime.startTime, selectedEndTime: selectedTime.endTime, tid:tid, date: date})
        })
    }

    const postRecommendation = async (rec) => {
        
        var data = 
        {
            uid: currentUser.id, 
            tid: tid, 
            added_to_cal: false, 
            chosen: false, 
            min_offset: 0,
            start_time: `${parseDate(date, false)} ${rec.startTime}`, 
            end_time: `${parseDate(date, false)} ${rec.endTime}`
        };
        console.log(JSON.stringify(data))
        
        setTimeout(async () => {
            try {
                    const response = await backend.post(`/recommendations`, data)
            } catch (error) {
                console.error("error: " + error)
            }
        }, 300) 
                
        
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
