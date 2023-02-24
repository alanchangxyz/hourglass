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

// const styles = StyleSheet.create({});

const ScheduleTimeRangeView = ({navigation, route}) => {
    console.log(route.params)
    const [timeRangeStart, setTimeRangeStart] = useState(new Date())

    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Button
                    title="Next"
                    onPress={() =>
                        navigation.navigate("Choose a Time Slot")
                    }
                />
            </ScrollView>
            
            <DatePicker date={timeRangeStart} onDateChange={setTimeRangeStart} />
        </SafeAreaView>
    );
};

export default ScheduleTimeRangeView;
