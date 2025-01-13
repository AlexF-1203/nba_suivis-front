import React from 'react';
import { NavigationContainer } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>NBA Suivis App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
