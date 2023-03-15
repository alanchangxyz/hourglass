import {
    StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
    scrollArea: {
        height: '100%',
        backgroundColor:'#FFFFFF',
        alignItems: 'center',
        paddingVertical: 15
    },
    card: {
        width: '90%',
        height: 72,
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    taskName: {
        fontWeight: 500,
        fontSize: 14,
        color: 'black'
    },
    taskDuration: {
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 12,
        color: 'black'
    },
    selectedTaskName: {
        fontWeight: 500,
        fontSize: 14,
        color: 'white'
    },
    selectedCard: {
        width: '90%',
        height: 72,
        backgroundColor: '#34c6f3',
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    selectedTaskDuration: {
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 12,
        color: 'white'
    },
    fieldTitle: {
        fontWeight: 400,
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 15,
        color: 'black'
    },
    textInput: {
        borderWidth: 1,
        marginHorizontal: 20,
        padding: 10
    },
    taskDurationFields: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 30,
    },
    childView: {
        height: 50,
        flexDirection: "row"
    },
    scheduleCard: {
        width: '90%',
        height: 60,
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    selectedCard: {
        width: '90%',
        height: 60,
        backgroundColor: '#34c6f3',
        borderRadius: 10,
        padding: 18,
        marginVertical: 10,
    },
    validButton: {
        alignSelf: "center"
    },
    timeSelectorContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    timeSelectorTitle: {
        alignSelf: 'center'
    }

  });

export function convertMilitaryTime(time) {
    time = time.split(":")
    var hour = time[0]
    var minute = time[1]
    var ampm 
    hour = parseInt(hour)
    if (hour >= 12) {
        if (hour > 12) {
            hour %= 12
        }
        ampm = " PM"
    } else {
        if (hour == 0) {
            hour = 12
        }
        ampm = " AM"
    }
    return hour.toString() + ":" + minute.toString() + ampm
}

export function parseDate(string) {
    var parts_of_date = string.split("/")
    var month = parts_of_date[0] 
    var day = parts_of_date[1]
    if (month.length == 1) {
        month = "0" + month 
    }
    if (day.length == 1) {
        day = "0" + day
    }
    return month + "-" + day + "-" + parts_of_date[2]
}

export function parseTime(string) {
    var time = string.split(" ")[1].split(":")
    var ampm = string.split(" ")[2]
    var hour = parseInt(time[0])
    var minute = time[1]
    var second = time[2]

    if (ampm == "PM" && hour != 12) {
        hour = hour + 12
    } else if ( ampm == "AM" && hour == 12) {
        hour = 0
    }
    hour = hour.toString()
    if (hour.length == 1) {
        hour = "0" + hour
    }
    return hour + ":" + minute + ":" + second
}