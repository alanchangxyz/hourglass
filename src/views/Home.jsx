import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';

const styles = StyleSheet.create({
  headerName: {
    fontSize: 36,
    color: 'black',
    lineHeight: 44,
  },
  eventList: {
    height: '70%',
  },
  calCard: {
    width: '80%',
    height: 72,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  recCard: {
    width: '80%',
    height: 72,
    backgroundColor: '#E6E6E6',
    borderStyle: 'dashed',
    borderWidth: 3,
    borderColor: '#34C6F4',
    borderRadius: 10,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  eventNameView: {
    justifyContent: 'center',
    marginHorizontal: 14,
  },
  eventName: {
    fontWeight: 'bold',
    color: 'black',
  },
  startTime: {
    fontSize: 12,
    color: 'black',
  },
  endTime: {
    fontSize: 12,
    color: '#515151',
  },
  recEventName: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'black',
  },
  recStartTime: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'black',
  },
  recEndTime: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#515151',
  },
  addToCal: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
    fontSize: 12,
    color: 'black',
  },
  dateCard: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  dateCardFocused: {
    width: 40,
    height: 40,
    backgroundColor: '#34C6F4',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  dateList: {
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
  },
  dayName: {
    textAlign: 'center',
    color: '#515151',
  },
  dayNum: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  dayNameFocused: {
    textAlign: 'center',
    color: 'white',
  },
  dayNumFocused: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

const DATA = [
  {
    id: 0,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: false,
  },
  {
    id: 1,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: true,
  },
  {
    id: 2,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: false,
  },
  {
    id: 3,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: false,
  },
  {
    id: 4,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: true,
  },
  {
    id: 5,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: false,
  },
  {
    id: 6,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: false,
  },
  {
    id: 7,
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    name: 'Event Name',
    is_recommendation: true,
  },
];

// Request to Google Calendar API for the date
async function getGoogleCalendarData(date) {
  date = date.toLocaleDateString().replaceAll('/', '-');
  try {
    const response = await fetch(`https://hourglass.alanchang.xyz/api/calendar/${date}`);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
    return DATA;
  }
}

// Request to database for tasks user scheduled for the date based on recommendations but marked as later
function getScheduledTaskData(date) {
  return [];
}

// Merge calendar event data
// TODO: Merge based on start time
function mergeCalendarEvents(googleCalendarEvents, scheduledEvents) {
  return googleCalendarEvents.concat(scheduledEvents);
}

// Get google calendar and scheduled data and merge them into one list
async function getHomepageCalData(date) {
  googleCalendarData = await getGoogleCalendarData(date);
  // scheduledTaskData = getScheduledTaskData();
  // combinedEventData = mergeCalendarEvents(googleCalendarData, scheduledTaskData);
  return googleCalendarData;
}

const Header = props => {
  return (
    <View>
      <Text style={styles.headerName}>Hello {props.name},</Text>
      <Text>Check out your daily schedules:</Text>
    </View>
  );
};

const DateCard = props => {
  async function onSelectDateCard() {
    // Update the DateCard that is highlighted
    props.updateFocused();

    // Get the homepage data
    homepageData = await getHomepageCalData(props.date);

    // Set the data from the calendar
    props.setCalendarData(homepageData);
  }
  return (
    <TouchableWithoutFeedback onPress={() => onSelectDateCard()}>
      <View style={props.isFocused ? styles.dateCardFocused : styles.dateCard}>
        <Text style={props.isFocused ? styles.dayNameFocused : styles.dayName}>
          {props.dayName}{' '}
        </Text>
        <Text style={props.isFocused ? styles.dayNumFocused : styles.dayNum}>{props.dayNum}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const DateList = props => {
  const [dateIndex, setDateIndex] = useState(0);

  dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Adds a given number of days to a date
  function addDay(date, days) {
    date.setDate(date.getDate() + days);
    return date;
  }

  // gets the dates from today until a specified number of days (defualt 14)
  function getDates(days) {
    // sets default number of days to 14
    days = days ? days : 14;

    let dates = [];
    let date = new Date();

    while (dates.length < 14) {
      dates.push(new Date(date));
      date = addDay(date, 1);
    }
    return dates;
  }
  let dateList = getDates();
  const renderDateCard = ({ item, index }) => (
    <DateCard
      date={item}
      dayName={dayOfWeek[item.getDay()]}
      dayNum={item.getDate()}
      isFocused={index === dateIndex}
      updateFocused={() => setDateIndex(index)}
      setCalendarData={props.setCalendarData}
    />
  );

  return (
    <View style={styles.dateList}>
      <FlatList
        horizontal={true}
        data={dateList}
        renderItem={renderDateCard}
        keyExtractor={item => item.getTime()}
      />
    </View>
  );
};

const CalendarCard = props => {
  return (
    <View style={styles.calCard}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.startTime}> {props.start_time} </Text>
          <Text style={styles.endTime}> {props.end_time} </Text>
        </View>
        <View style={styles.eventNameView}>
          <Text style={styles.eventName}>{props.name}</Text>
        </View>
      </View>
    </View>
  );
};

const RecommendationCard = props => {
  return (
    <View style={styles.recCard}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.recStartTime}> {props.start_time} </Text>
          <Text style={styles.recEndTime}> {props.end_time} </Text>
        </View>
        <View style={styles.eventNameView}>
          <Text style={styles.recEventName}>{props.name}</Text>
        </View>
        <View style={styles.eventNameView}>
          <Text style={styles.addToCal}>Add to Google Calendar</Text>
        </View>
      </View>
    </View>
  );
};

const Home = () => {
  const [calData, setCalData] = useState();
  useEffect(() => {
    getHomepageCalData(new Date()).then(data => setCalData(data));
  }, []);

  function getEventTime(dateTime) {
    date = new Date(dateTime);
    hours = Number(dateTime.substring(11, 13));
    minutes = dateTime.substring(14, 16);
    if (hours > 12) {
      day_abbr = 'PM';
      hours -= 12;
    } else {
      day_abbr = 'AM';
    }
    return hours + ':' + minutes + ' ' + day_abbr;
  }

  const renderEventCard = ({ item }) => (
    <CalendarCard
      start_time={getEventTime(item.start.dateTime)}
      end_time={getEventTime(item.end.dateTime)}
      name={item.summary}
    />
  );

  return (
    <View>
      <Header name={'Alan'} />
      <DateList setCalendarData={setCalData} />
      <FlatList
        style={styles.eventList}
        data={calData}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Home;
