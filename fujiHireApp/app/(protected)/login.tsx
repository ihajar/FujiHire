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
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    // Simple email regex for validation
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const doLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in both email and password.",
      });
      return;
    }
    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
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
          <TextInput
            className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
            placeholder="Email address"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            secureTextEntry={true}
            className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
            placeholder="Password"
            placeholderTextColor="#fff"
            value={password}
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={setPassword}
          />
          <Pressable onPress={() => router.replace('/signup')} className="my-2 items-end w-full">
            <Text className=" text-lg font-semibold text-white">Forgot Password?</Text>
          </Pressable>
          <Pressable
            className="bg-secondary rounded-lg p-3 items-center justify-center my-2 w-full"
            onPress={doLogin}
            disabled={isLoading}
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
