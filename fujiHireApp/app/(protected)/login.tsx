import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useForm } from '@tanstack/react-form'
import { useAuth } from "@/context/AuthContext";



export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async({ value }) => {
      const { email, password } = value;
      setIsLoading(true);
      try {
        await login(email, password);
        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: error instanceof Error ? error.message : 'An unexpected error occurred.',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="flex-1 w-full h-full bg-primary"
      style={{ justifyContent: 'center' }} // Tailwind's bg-pink-400
    >
      <Animated.Image
      entering={FadeIn.duration(600)}
      source={require("@/assets/images/Logo-white.png")}
      className="self-center w-4/5 h-[230px] mt-10 absolute top-0"
      resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-center mb-5 text-accent font-rametto">
        Welcome Back
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="w-full px-4"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="items-center w-full">
          <form.Field
            name='email'
            validators={{
              onChange: ({ value }) => 
                !value
                  ? 'Email is required'
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ? 'Invalid email'
                  : undefined,
            }}
            children={(field) => (
              <View>
                 <TextInput
                  className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
                  placeholder="Email address"
                  placeholderTextColor="#fff"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {field.state.meta.errors?.[0] && (
                  <Text className="text-red-600">
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </View>
            )}
          />
         <form.Field
            name='password'
            validators={{
              onChange: ({ value }) => 
                !value ? 'Password is required' : undefined,
            }}
            children={(field) => (
              <View>
                <TextInput
                  secureTextEntry={true}
                  className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
                  placeholder="Password"
                  placeholderTextColor="#fff"
                  value={field.state.value}
                  autoCapitalize="none"
                  onChangeText={(val) => field.handleChange(val)}
                />
                {field.state.meta.errors?.[0] && (
                  <Text className="text-red-600">
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </View>
            )}
         />
          
          <Pressable onPress={() => router.replace('/(protected)/request-password-reset')} className="my-2 items-end w-full">
            <Text className=" text-lg font-semibold text-white">Forgot Password?</Text>
          </Pressable>
          <Pressable
            className="bg-secondary rounded-lg p-3 items-center justify-center my-2 w-full"
            onPress={() => form.handleSubmit()}
          >
            <Text className="text-white text-lg font-bold">Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <View className="flex-row justify-center mt-4">
        <Text className="text-base text-white">Don't have an account? </Text>
        <Pressable onPress={() => router.replace('/signup')}>
          <Text className="text-base text-accent font-bold underline">Sign Up</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
