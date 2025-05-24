import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'

interface LoadingScreenProps {
    onTimeout: () => void;
}

export default function LoadingScreen({ onTimeout }: LoadingScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onTimeout();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onTimeout]);
    
  return (
    <Animated.View entering={FadeIn.duration(600)} className="flex-1 justify-center items-center p-10">
        <ActivityIndicator size={'large'} color={Colors.light.text} />
        <Text className='mt-10 text-lg text-center text-[#666]'>Customizing your app experience...</Text>
    </Animated.View>
  )
}