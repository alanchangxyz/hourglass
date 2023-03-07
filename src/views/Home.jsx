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

const API_URL = `https://hourglass.alanchang.xyz/api`;

function recommendationFilter(obj, date) {
  // recommendation should be chosen, not added to the calendar, and
  // have a start date corresponding with the given date
  start_time = new Date(obj.start_time.substring(0, 17));
  date_check = new Date(date);

  same_day =
    start_time.getFullYear() == date_check.getFullYear() &&
    start_time.getMonth() == date_check.getMonth() &&
    start_time.getDay() == date_check.getDay();
  return obj.chosen && !obj.added_to_cal && same_day;
}

// Request to Google Calendar API for the date
async function getGoogleCalendarData(date) {
  date = date.toLocaleDateString().replaceAll('/', '-');
  try {
    const response = await fetch(`${API_URL}/calendar/${date}`);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Request to database for tasks user scheduled for the date based on recommendations but marked as later
async function getScheduledTaskData(date) {
  try {
    const response = await fetch(`${API_URL}/recommendations`);
    const responseJson = await response.json();
    return responseJson.filter(element => recommendationFilter(element, date));
  } catch (error) {
    console.error(error);
    return DATA;
  }
}

// Merge calendar event data
// TODO: Merge based on start time
function mergeCalendarEvents(googleCalendarEvents, scheduledEvents) {
  if (!scheduledEvents) {
    return googleCalendarEvents;
  } else if (!googleCalendarEvents) {
    return scheduledEvents;
  }
  var i = 0;
  var j = 0;
  var sortedArr = [];
  while (i < googleCalendarEvents.length && j < scheduledEvents.length) {
    calTime = new Date(googleCalendarEvents[i].start.dateTime);
    schedTime = new Date(scheduledEvents[j]['start_time']);
    if (calTime < schedTime) {
      sortedArr.push(googleCalendarEvents[i]);
      i++;
    } else {
      sortedArr.push(scheduledEvents[j]);
      j++;
    }
  }
  if (i < googleCalendarEvents.length) {
    return sortedArr.concat(googleCalendarEvents.splice(i, googleCalendarEvents.length));
  } else {
    return sortedArr.concat(scheduledEvents.splice(j, scheduledEvents.length));
  }
}

async function addTaskName(recTaskData) {
  for (let i = 0; i < recTaskData.length; i++) {
    const response = await fetch(`${API_URL}/tasks/${recTaskData[i].tid}`);
    const responseJson = await response.json();
    recTaskData[i]['name'] = await responseJson.name;
  }
  return recTaskData;
}

// Get google calendar and scheduled data and merge them into one list
async function getHomepageCalData(date) {
  googleCalendarData = await getGoogleCalendarData(date);
  scheduledTaskData = await getScheduledTaskData(date);
  // scheduledTaskData = await addTaskName(scheduledTaskData);
  combinedEventData = await mergeCalendarEvents(googleCalendarData, scheduledTaskData);
  return combinedEventData;
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
    if (hours >= 12) {
      day_abbr = 'PM';
      hours -= hours != 12 ? 12 : 0;
    } else {
      day_abbr = 'AM';
    }
    return hours + ':' + minutes + ' ' + day_abbr;
  }

  function getEventTimeRec(dateTime) {
    date = new Date(dateTime);
    hours = Number(dateTime.substring(17, 19));
    minutes = dateTime.substring(20, 22);
    if (hours >= 12) {
      day_abbr = 'PM';
      hours -= hours != 12 ? 12 : 0;
    } else {
      day_abbr = 'AM';
    }
    return hours + ':' + minutes + ' ' + day_abbr;
  }

  const renderEventCard = ({ item }) => {
    return item.chosen ? (
      <RecommendationCard
        start_time={getEventTimeRec(item['start_time'])}
        end_time={getEventTimeRec(item['end_time'])}
        tid={item.tid}
      />
    ) : (
      <CalendarCard
        start_time={getEventTime(item.start.dateTime)}
        end_time={getEventTime(item.end.dateTime)}
        name={item.summary}
      />
    );
  };

  return (
    <View>
      <Header name={'Alan'} />
      <DateList setCalendarData={setCalData} />
      <FlatList
        style={styles.eventList}
        data={calData}
        renderItem={renderEventCard}
        keyExtractor={item => (item.chosen ? item['rid'] : item.id)}
      />
    </View>
  );
};

export default Home;
