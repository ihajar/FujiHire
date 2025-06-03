import React from 'react';
import { View, TextInput, Text } from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export default function VerificationInput({ value, onChangeText, error }: Props) {
  const handleChange = (text: string) => {
    // Only allow numbers and max 6 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    onChangeText(cleaned);
  };

  return (
    <View className="w-full">
      <TextInput
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={6}
        className={`text-2xl tracking-widest text-center p-4 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Enter 6-digit code"
      />
      {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}
    </View>
  );
}
