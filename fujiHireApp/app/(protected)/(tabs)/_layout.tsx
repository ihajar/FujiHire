import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// import BlurTabBarBackground from '@/components/ui/TabBarBackground.ios';
import TabBarBackground from '@/components/ui/TabBarBackground';
import TabBarIcon from '@/components/TabBarIcon';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function TabLayout() {
    const colorScheme = useColorScheme();
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: true,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
                ios: {
                    position: 'absolute',
                },
                default: {},
            }),
            
        }}
    >
        <Tabs.Screen
            name='index'
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
            }}
        />
    </Tabs>
  )
}

