import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";


export default function ProtectedLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/(protected)/login');
    } else if (!user?.emailVerified) {
      router.replace('/(protected)/verify-email');
    }
  }, [isLoading, isAuthenticated, user?.emailVerified]);

  // if (isLoading || !initialCheckDone) {
  //   return <AuthLoadingScreen />
  // }
  return (
    <Stack
      screenOptions={{
      headerStyle: { backgroundColor: '#3b308e' },
      headerTintColor: '#fff',
      headerTitleStyle: { color: '#fff' }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen
      name="verify-email"
      options={{
        title: 'Verify Email',
        headerLeft: () => {
        const router = useRouter();
        return (
          <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          style={{ marginLeft: 16, alignSelf: 'flex-start' }}
          onPress={() => router.replace('/(protected)/login')}
          />
        );
        },
        headerShown: true,
      }}
      />
      <Stack.Screen name="request-password-reset" options={{ headerShown: false }} />
    </Stack>
  );
}