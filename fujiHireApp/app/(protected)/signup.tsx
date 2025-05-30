import React, { useState } from "react";
import Toast from "react-native-toast-message";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import Animated, { FadeIn } from "react-native-reanimated";
import { Redirect, useRouter } from "expo-router";

export default function Signup() {
    const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const doLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in both email and password.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      Toast.show({
        type: "success",
        text1: "Login Successful",
      });
    } catch (error) {
      // console.error("Login failed:", error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="flex-1 justify-center items-center w-full h-full"
      style={{  justifyContent: 'flex-start' }} // Tailwind's bg-pink-400
    >
      <Animated.Image
        entering={FadeIn.duration(600)}
        source={require("@/assets/images/logo.png")}
        className="self-center w-2/3 h-[150px] mt-10"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-center mb-5">
        Welcome Back!
        {"\n"}
        Please login to continue.
      </Text>
      <KeyboardAvoidingView behavior="padding" className="w-full px-4">
        <View className="items-center w-full">
          <TextInput
            className="my-2 h-[50px] border border-blackish/60 rounded-full p-2.5 w-full"
            placeholder="Email address"
            placeholderTextColor="gray"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            secureTextEntry={true}
            className="my-2 h-[50px] border border-blackish/60 rounded-full p-2.5 w-full"
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={setPassword}
          />
          <Pressable
            className="bg-primary rounded-full p-3 items-center justify-center my-2 w-full"
            onPress={doLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-bold">Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <View className="flex-row justify-center mt-4">
        <Text className="text-base text-gray-700">Already have an account?</Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text className="text-base text-primary font-bold underline">Login</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
