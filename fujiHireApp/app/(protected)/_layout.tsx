
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";


export default function ProtectedLayout() {
  const { user, loading } = useAuth();
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