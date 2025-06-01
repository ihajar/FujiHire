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
import { UserRole } from "@/types/user";

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const doSignup = async () => {
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
      await signup(email, password, role);
      Toast.show({
        type: "success",
        text1: "Signup Successful",
      });
      // Optionally redirect to login or home
      // router.replace('/login');
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
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
        Create account
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="w-full px-4"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View className="items-center w-full">
          {/* Role selection */}
          <View className="flex-row mb-4 w-full justify-center">
            <Pressable
              className={`px-4 py-2 rounded-lg mr-2 ${
                role === UserRole.JOB_SEEKER ? "bg-accent" : "transparent"
              }`}
              onPress={() => setRole(UserRole.JOB_SEEKER)}
            >
              <Text
                className={
                  role === UserRole.JOB_SEEKER ? "text-blackish" : "text-white"
                }
              >
                Job Seeker
              </Text>
            </Pressable>
            <Pressable
              className={`px-4 py-2 rounded-lg ${
                role === UserRole.EMPLOYER ? "bg-accent" : "bg-transparent"
              }`}
              onPress={() => setRole(UserRole.EMPLOYER)}
            >
              <Text
                className={
                  role === UserRole.EMPLOYER ? "text-blackish" : "text-white"
                }
              >
                Employer
              </Text>
            </Pressable>
          </View>
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
          <Pressable
            className="bg-secondary rounded-lg p-3 items-center justify-center my-2 w-full"
            onPress={doSignup}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-bold">Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <View className="flex-row justify-center mt-4">
        <Text className="text-base text-white">
          Already have an account?
        </Text>
        <Pressable onPress={() => router.replace("/login")}>
          <Text className="text-base text-accent font-bold underline">
            Login
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
