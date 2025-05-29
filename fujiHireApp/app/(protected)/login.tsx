import { Button, KeyboardAvoidingView, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <KeyboardAvoidingView behavior='padding' className='w-full px-4'>
        <Text>Email</Text>
        <TextInput
          className='my-1 h-13 border-1 rounded-md p-2.5 bg-accent/20'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <Text>Password</Text>
        <TextInput 
          secureTextEntry={true}
          className='my-1 h-13 border-1 rounded-md p-2.5 bg-accent/20'
          value={password}
          autoCapitalize='none'
          keyboardType='default'
          onChangeText={setPassword}
        />
       <Button onPress={() => {}} title='login'/>
      </KeyboardAvoidingView>
    </View>
  )
}

