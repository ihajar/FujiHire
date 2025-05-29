
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";


export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  
  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(protected)";
    if (user && !inAuthGroup) {
      router.replace("/(protected)/(tabs)")
    } else if(!user && inAuthGroup) {
      router.replace("/login");
    }
  }, [user, loading])
  // const inAuthGroup
  if (user === null || !user?.token) <Redirect href="/login" />
  if (loading) {
    return <AuthLoadingScreen />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}