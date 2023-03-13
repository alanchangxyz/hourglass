import React, { useState, useEffect } from 'react';
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
import { useIsFocused } from '@react-navigation/native';

import { ScheduleCard, styles, convertMilitaryTime} from '../utils/utils'
import { useBackend } from '../util/Backend';


const SchedulePickTimeSlotView = ({navigation, route}) => {
    console.log('Route params', route.params)

    const {taskName, taskDuration, timeRangeStart, timeRangeEnd, date, tid} = route.params;
    const [rankedRecommendations, setRankedRecommendations] = useState([]);
    const [selectedTime, setSelectedTime] = useState({});
    const isFocused = useIsFocused();
    const { backend }  = useBackend();

    // console.log(date)
    // console.log(timeRangeEnd)
    // console.log(timeRangeStart)
    // send stuff to backend to create recommendations
    // retrieve recommendations from backend

    const getRecommendations = async () => {
        console.log("RECOMMENDATIONS");
        console.log(`/recommendations/generate/${tid}/${date}/${timeRangeStart}/${timeRangeEnd}`);
        const res = await backend.get(`/recommendations/generate/${tid}/${date}/${timeRangeStart}/${timeRangeEnd}`);
        console.log('data is', res.data);
        setRankedRecommendations(res.data);
        if (res.data.length > 0) {
            setSelectedTime(res.data[0]);
            console.log(res.data[0]);
        }    
    };

    // const ranked_recommendations = [{startTime: "11:00:00", endTime: "11:30:00"}, 
    //                           {startTime: "11:15:00", endTime: "11:45:00"},
    //                           {startTime: "11:30:00", endTime: "12:00:00"},
    //                           {startTime: "13:00:00", endTime: "13:30:00"},
    //                           {startTime: "13:15:00", endTime: "13:45:00"}]

    
    const [page, setPage] = useState(1)

    // const RecommendationCards = () => {
    //     return (rankedRecommendations.slice((page - 1) * 4, page * 4).map((rec) => 
    //         <ScheduleCard time={rec} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>)
    //     )
    // }

    const confirmation = () => {
        rankedRecommendations.forEach( (rec) => {
            if (rec.startTime !== selectedTime.startTime) {
                // post recommendation to database
                console.log()
            } 
            navigation.navigate("Your Task Has Been Scheduled", {selectedStartTime: selectedTime.startTime, selectedEndTime: selectedTime.endTime, taskName: taskName, taskDuration: taskDuration})
        })
    }

    useEffect(() => {
        console.log('use effect is running');
        
            getRecommendations();
        
    }, []);
    // getRecommendations();

    return selectedTime !== {} && (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollArea}>
            <Text style={styles.fieldTitle}> Your task is currently scheduled for: </Text>
            <Text style={styles.fieldTitle}> {convertMilitaryTime(selectedTime?.startTime)} - {convertMilitaryTime(selectedTime?.endTime)}</Text>
            <View style={styles.childView}> 
                <Button title="See prev recs" onPress={() => (page !== 1 )? setPage(page - 1): setPage(page)} style={styles.validButton}/>
                <Button title="See more recs" onPress={() => (page !== Math.trunc(rankedRecommendations.length / 4) + 1) ? setPage(page + 1): setPage(page)} style={styles.validButton}/>
            </View>
            
                {rankedRecommendations.slice((page - 1) * 4, page * 4).map((rec) => <ScheduleCard time={rec} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>)}

                <Button
                    title="Confirm Time"
                    onPress={confirmation}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SchedulePickTimeSlotView;
