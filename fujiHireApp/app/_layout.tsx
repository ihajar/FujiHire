import "../global.css";
import { Slot} from 'expo-router';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    RamettoOne: require('../assets/fonts/RammettoOne-Regular.ttf'),
  });

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{ backgroundColor: '#C2EABD', borderLeftWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 16, color: '#3D9B31' }}
        text2Style={{ fontSize: 14, color: '#3D9B31' }} 
      />
    ),
    error: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{ backgroundColor: '#FAC6D2', borderLeftWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 16, color: '#EE2F59' }}
        text2Style={{ fontSize: 14, color: '#EE2F59' }}
      />
    ),
  };
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Slot />
          <Toast config={toastConfig} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
