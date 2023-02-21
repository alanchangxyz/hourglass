import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Divider } from 'react-native-elements'



const styles = StyleSheet.create({
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
        alignItems:"center",
        justifyContent:"center",
        marginHorizontal: 14,
    },
    eventName: {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: 14,
        color: 'black',
        },
    startTime: {
        fontWeight: 400,
        fontSize: 12,
        color: 'black',
    },
    endTime: {
        fontWeight: 400,
        fontSize: 12,
        color: '#515151',
        }
  });

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
    )
}

const RecommendationCard = props => {
    return (
        <View style={styles.recCard}>
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
    )
}

const Home = () => {

  return (<View>
            <CalendarCard start_time="9:00 AM" end_time="9:30 AM" name="Event Name"/>
            <RecommendationCard start_time="9:00 AM" end_time="9:30 AM" name="Event Name"/>
          </View>
         );
};

export default Home;
