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

const SchedulePickTimeSlotView = ({navigation, route}) => {
    console.log(route.params)
    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Button
                    title="Next"
                    onPress={() =>
                        navigation.navigate("Your Task Has Been Scheduled")
                    }
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SchedulePickTimeSlotView;
