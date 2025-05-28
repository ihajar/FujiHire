import { ActivityIndicator, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

export default function AuthLoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size={'large'} color={Colors.light.text} />
      <Text style={{ marginTop: 24, fontSize: 18, color: '#666', textAlign: 'center' }}>
        Checking authentication status...
      </Text>
    </View>
  );
}
