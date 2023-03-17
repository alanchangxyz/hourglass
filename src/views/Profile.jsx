import React, { useCallback } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { ALANS_EMAIL, OLIVIAS_EMAIL } from '@env';
import { useAuth } from '../util/Auth';
import { useBackend } from '../util/Backend';

const styles = StyleSheet.create({
  profileContainer: {
    height: Dimensions.get('window').height,
  },
});

const SwitchUserButton = ({ url, switchUser, children }) => {
  const handlePress = useCallback(async () => {
    console.log('BEFORE OPEN');
    await Linking.openURL(url);
    console.log('AFTER OPEN');
    switchUser();
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const Profile = () => {
  const { changeUser, currentUser } = useAuth();

  const changeCurrUser = () => {
    console.log('SWITCHING USER');
    changeUser(currentUser?.email === ALANS_EMAIL ? OLIVIAS_EMAIL : ALANS_EMAIL);
  };

  return (
    <View style={styles.profileContainer}>
      <View style={{}}>
        <View style={{ marginBottom: 30 }}>
          <View
            style={{
              height: 200,
              width: 200,
              backgroundColor: '#fff',
              borderRadius: 100,
              marginTop: 50,
              marginLeft: 100,
            }}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 2,
            fontWeight: 600,
            fontSize: 18,
            color: 'black',
          }}>
          {currentUser?.fname} {currentUser?.lname}
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 2, marginBottom: 5, fontSize: 16 }}>
          {currentUser?.email}
        </Text>
      </View>
      <View style={{ marginLeft: '25%', marginRight: '25%', marginTop: 10 }}>
        <SwitchUserButton
          url={'https://hourglass.alanchang.xyz/api/authorize'}
          switchUser={() => changeCurrUser()}>
          Switch User
        </SwitchUserButton>
      </View>
    </View>
  );
};

export default Profile;
