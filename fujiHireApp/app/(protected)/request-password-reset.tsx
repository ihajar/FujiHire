import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import Animated, { FadeIn } from "react-native-reanimated";
import { request } from "@/utils/api";
import { View } from "react-native-reanimated/lib/typescript/Animated";



interface ResetPasswordParams {
  email: string;
  code: string;
  password: string;
}

export default function PasswordReset() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  

  const sendPasswordResetTokenMutation = useMutation({
    mutationFn: async (email: string) => {
      return await request<void>({
        endpoint: `/api/v1/auth/send-password-reset-token?email=${email}`,
        method: "PUT",
      });
    },
    onSuccess: () => {
      setEmailSent(true);
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, code, password }: ResetPasswordParams) => {
      return await request<void>({
        endpoint: `/api/v1/auth/reset-password?email=${email}&token=${code}&newPassword=${password}`,
        method: "PUT",
      });
    },
    onSuccess: () => {
      router.replace("/(protected)/login");
    }
  });

  const emailForm = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      await sendPasswordResetTokenMutation.mutateAsync(value.email);
      setEmail(value.email);
    },
  });

  const resetForm = useForm({
    defaultValues: {
      code: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await resetPasswordMutation.mutateAsync({
        email,
        code: value.code,
        password: value.password,
      });
    },
  });

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="flex-1 w-full h-full bg-primary"
      style={{ justifyContent: "center" }}
    >
      <Animated.Image
        entering={FadeIn.duration(600)}
        source={require("@/assets/images/Logo-white.png")}
        className="self-center w-4/5 h-[230px] mt-10 absolute top-0"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-center mb-5 text-accent font-rametto">
        Forgot Password
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="w-full px-4"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {!emailSent ? (
          <View>
            <emailForm.Field
              name="email"
              validators={{
                onChange: ({ value }) => 
                  !value
                    ? 'Email is required'
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'Invalid email address'
                    : undefined
              }}
              children={( field ) => (
                <View>
                  <TextInput
                    className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
                    placeholder="Email address"
                    placeholderTextColor="#fff"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                  />
                  {field.state.meta.errors?.[0] && (
                    <Text className="text-red-600">{field.state.meta.errors[0]}</Text>
                  )}
                </View>
              )}
            />
            <Pressable
              className="bg-secondary rounded-lg p-3 items-center justify-center my-2 w-full"
              onPress={() => emailForm.handleSubmit()}
              disabled={sendPasswordResetTokenMutation.isPending}
            >
              <Text className="text-white text-lg font-bold">Reset Password</Text>
            </Pressable>
          </View>
          
        ) : (
          <View>
            <resetForm.Field
              name="code"
              validators={{
                onChange: ({ value }) => (!value ? 'Code is required' : undefined)
              }}
              children={( field ) => (
                <View>
                  <TextInput
                    className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
                    placeholder="Reset code"
                    placeholderTextColor="#fff"
                    autoCapitalize="none"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                  />
                  {field.state.meta.errors?.[0] && (
                    <Text className="text-red-600">{field.state.meta.errors[0]}</Text>
                  )}
                </View>
              )}
            />
            <resetForm.Field 
              name='password'
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Password is required' : value.length < 6 ? "Too short" : undefined,
              }}
              children={( field ) => (
                <View>
                  <TextInput
                    className="my-2 h-[50px] border border-white rounded-lg p-2.5 w-full text-white"
                    placeholder="New password"
                    placeholderTextColor="#fff"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                  />
                  {field.state.meta.errors?.[0] && (
                    <Text className="text-red-600">{field.state.meta.errors[0]}</Text>
                  )}
                </View>
              )}
            />
            <Pressable
              className="bg-secondary rounded-lg p-3 items-center justify-center my-2 w-full"
              onPress={() => resetForm.handleSubmit()}
              disabled={resetPasswordMutation.isPending}
            >
              <Text className="text-white text-lg font-bold">Resert Password</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
