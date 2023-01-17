import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const Home = () => {
    const [name, setName] = useState('user');
    return (
        <View>
            <Text>
                Hello {name}!
            </Text>
        </View>
    );
};

export default Home;