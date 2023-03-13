import React from 'react';
import {
  Button,
  Dimensions,
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
  profileContainer: {
    height: Dimensions.get('window').height,
  },
});

const Profile = () => {
  const { changeUser, currentUser } = useAuth();

  return (
    <View style={styles.profileContainer}>
      <View style={{}}>
        <View style={{ marginBottom: 30 }}>
          <View style={{ height: 200, width: 200, backgroundColor: '#fff', borderRadius: 100, marginTop: 50, marginLeft: 100}} />
        </View>
        <Text style={{ textAlign: 'center', marginBottom: 2, fontWeight: 600, fontSize: 18, color: 'black' }}>{currentUser?.fname} {currentUser?.lname}</Text>
        <Text style={{ textAlign: 'center', marginTop: 2, marginBottom: 5, fontSize: 16, }}>{currentUser?.email}</Text>
      </View>
      <View style={{ marginLeft: "25%", marginRight: "25%", marginTop: 10 }}>
        <Button
          title="Switch User"
          onPress={() => changeUser(currentUser?.email === ALANS_EMAIL ? OLIVIAS_EMAIL : ALANS_EMAIL)}
        />
      </View>
    </View>
  );
};

export default Profile;
