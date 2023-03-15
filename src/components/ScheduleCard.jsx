import React from 'react';
import {
    Text,
    View,
    Pressable
} from 'react-native';

import {styles, convertMilitaryTime} from '../utils/utils'

export const ScheduleCard = props => {
    const updateSelection = () => {
        if (props.selectedTime.startTime !== props.time.startTime) {
            props.setSelectedTime(props.time)
        };
    }

    return (
        <Pressable onPress={updateSelection}>
            <View style={(props.selectedTime.startTime === props.time.startTime)? styles.selectedCard : styles.scheduleCard}>
                <Text style={(props.selectedTime.startTime === props.time.startTime)? styles.selectedTaskName : styles.taskName}>
                    {convertMilitaryTime(props.time.startTime)} - {convertMilitaryTime(props.time.endTime)}
                </Text>
            </View>
        </Pressable>
    ) 
}