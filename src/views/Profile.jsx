import React, { useCallback, useEffect } from 'react';
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

import { REACT_APP_API_URL_PROD } from '@env';
import { useAuth } from '../util/Auth';
import { useBackend } from '../util/Backend';

const styles = StyleSheet.create({
  profileContainer: {
    height: Dimensions.get('window').height,
  },
});

const SwitchUserButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    Linking.openURL(url);
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const Profile = ({ route }) => {
  const { changeUser, currentUser } = useAuth();
  const params = route.params || {};
  console.log(params.email);
  useEffect(() => {
    if (params.email && params.email != currentUser) {
      changeUser(params.email);
    }
  }, [params]);

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
        <SwitchUserButton url={`${REACT_APP_API_URL_PROD}/authorize`}>Switch User</SwitchUserButton>
      </View>
    </View>
  );
};

export default Profile;
