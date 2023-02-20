import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScheduleView from "../views/Schedule";
import ScheduleTimeRangeView from "../views/ScheduleTimeRange";
import SchedulePickTimeSlotView from "../views/SchedulePickTimeSlot";
import ScheduleConfirmView from "../views/ScheduleConfirm";

const Stack = createNativeStackNavigator();

const schedule = "Choose a Task to Schedule";
const timeRange = "Choose a Time Range";
const pickSlot = "Choose a Time Slot";
const confirm = "Your Task Has Been Scheduled";

const ScheduleTabNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={schedule} component={ScheduleView}/>
            <Stack.Screen name={timeRange} component={ScheduleTimeRangeView}/>
            <Stack.Screen name={pickSlot} component={SchedulePickTimeSlotView}/>
            <Stack.Screen name={confirm} component={ScheduleConfirmView}/>
        </Stack.Navigator>
    )
}

export default ScheduleTabNavigator;