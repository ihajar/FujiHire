import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    FadeIn,
    useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/Colors";

interface TrialReminderProps {
  yearlyPrice: string;
  yearlyTotal: string;
  onStartFreeTrial: () => void;
}

export function TrialReminder({
  yearlyPrice,
  yearlyTotal,
  onStartFreeTrial,
}: TrialReminderProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const startAnimations = () => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-0.1, { duration: 200 }),
          withTiming(0.1, { duration: 200 }),
          withTiming(0, { duration: 200 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1, { duration: 200 }),
          withTiming(1, { duration: 2400 })
        ),
        -1,
        false
      );
    };

    const timeout = setTimeout(startAnimations, 1000);
    return () => {
        clearTimeout(timeout);
        rotation.value = 0;
        scale.value = 1;
    };
  }, []);

  const bellAnimatedStyle = useAnimatedStyle(() => {
    return {
        transform: [{ rotate: `${rotation.value}rad` }],
    };
  });
  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
        transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <Animated.View entering={FadeIn.duration(600)} className="items-center p-16 pb-0">
            <Text className="text-xl font-bold items-center mb-20 text-black">
                We'll send you a reminder before your free trial ends
            </Text>
            <Animated.View
                entering={FadeIn.duration(600).delay(300)}
                className="my-10"
                style={bellAnimatedStyle}
            >
                <View className="p-5 relative">
                    <Ionicons name="notifications" size={140} color="#E5E5E5" />
                    <Animated.View style={badgeAnimatedStyle} className="bg-red-600 absolute top-10 right-16 w-[32px] h-[32px] rounded-sm justify-center items-center" >
                        <Text className="text-base font-bold text-white">1</Text>
                    </Animated.View>
                </View>
            </Animated.View>
        </Animated.View>
      </View>
      <View className="p-5 pb-0 bg-white border-t-2 border-t-slate-300">
        <View className="mb-8 items-center">
            <Text className="text-lg text-center mb-0 text-black">No Payment Due Now</Text>
            <Text className="text-base text-center text-slate-600">
                Just {yearlyTotal} per year ({yearlyPrice}/ mo)
            </Text>
        </View>
        <TouchableOpacity
            className="p-3 m-5 rounded-xl items-center bg-primary border-2 border-primary/30"
            onPress={onStartFreeTrial}
        >
            <Text className="text-lg font-bold text-white">Continue for FREE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}