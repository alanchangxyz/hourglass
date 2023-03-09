import React, { useState } from 'react';
import {
  Button,
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

const styles = StyleSheet.create({
  changeUserButton: {
    backgroundColor: 'green',
    marginVertical: 16,
  },
});

const Profile = () => {
  const { changeUser, currentUser } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>The current user is {JSON.stringify(currentUser)}</Text>
      <Button
        style={styles.changeUserButton}
        title="Switch User"
        onPress={() => changeUser(currentUser?.email === ALANS_EMAIL ? OLIVIAS_EMAIL : ALANS_EMAIL)}
      />
    </View>
  );
};

export default Profile;
