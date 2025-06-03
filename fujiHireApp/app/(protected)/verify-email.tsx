import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "@tanstack/react-form";
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { request } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import VerificationInput from '@/components/VerificationInput';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';



export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, setUser, isLoading } = useAuth();

  const verifyMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      return await request<void>({
        endpoint: `/api/v1/auth/validate-email-verification-token?token=${verificationCode}`,
        method: 'PUT',
        body: JSON.stringify({ code: verificationCode }),
      });
    },
    onSuccess: () => {
      if (user) {
        setUser({ ...user, emailVerified: true });
        router.replace('/(protected)/(tabs)');
      }
    },
    onError: (error: Error) => {
      form.setFieldValue('code', '');
      form.setFieldMeta('code', (prev) => ({
        ...prev,
        error: error.message,
      }))
    },
  });

  const form = useForm({
    defaultValues: {
      code: '',
    },
    onSubmit: async({ value }) => {
      if (value.code.length !== 6) {
         form.setFieldMeta('code', (prev) => ({
        ...prev,
        error: "code must be 6 digits",
      }));
      }
      await verifyMutation.mutateAsync(value.code);
    },
  });

  const resendEmailVerificationTokenMutation = useMutation({
    mutationFn: async() => {
      return await request<void>({
        endpoint: `/api/v1/auth/send-email-verification-token`,
      })
    },
    onSuccess: () => {
      
    },
    onError: (error) => {
      form.setFieldMeta('code', (prev) => ({
        ...prev,
        error: error.message,
      }));
    }
  });

  return (
    <View className="flex-1 p-4 justify-center bg-primary">
      <Text className="text-2xl font-semibold text-center mb-2 text-accent font-rametto">
        Verify your email
      </Text>
      <Text className="text-base text-center mb-6 text-white">
        Please enter the 6-digit code sent to {user?.email}
      </Text>
      <View>
        <form.Field
          name='code'
          children={( field ) => (
            <>
              <VerificationInput
                value={field.state.value}
                onChangeText={field.handleChange}
                error={field.state.meta.errors?.[0]}
              />
              <TouchableOpacity
                onPress={() => form.handleSubmit()}
                disabled={verifyMutation.isPending}
                className="mt-6 bg-secondary p-4 rounded-lg items-center"
              >
                {verifyMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold">
                    Validate Email
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        />
      </View>
      <TouchableOpacity
        onPress={async() => await resendEmailVerificationTokenMutation}
        disabled={resendEmailVerificationTokenMutation.isPending}
        className="mt-6 bg-secondary p-4 rounded-lg items-center"
      >
        {resendEmailVerificationTokenMutation.isPending ? (
          <AuthLoadingScreen />
        ) : (
          <Text className="text-white font-bold">
            Send again
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}