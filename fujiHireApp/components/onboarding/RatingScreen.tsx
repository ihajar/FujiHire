import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";
import Animated, { FadeIn, FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export function RatingScreen() {
    const [rating, setRating] = useState(0);
    const star1 = useSharedValue(0);
    const star2 = useSharedValue(0);
    const star3 = useSharedValue(0);
    const star4 = useSharedValue(0);
    const star5 = useSharedValue(0);
    const animatedStars = [star1, star2, star3, star4, star5];

    useEffect(() => {
        setTimeout(() => {
            StoreReview.requestReview();
        }, 1500);
    }, []);
    // Trigger animation on mount
    useEffect(() => {
        const delay = 500;
        const animattionInterval = 200;

        setTimeout(() => {
            animatedStars.forEach((star, index) => {
                setTimeout(() => {
                    star.value = withSequence(withSpring(1.2, { damping: 8 }), withSpring(1, { damping: 8 }));
                    setRating(index + 1);
                }, index * animattionInterval)
            });
        }, delay)
    }, []);

    return (
        <View className="flex-1 justify-center items-center p-7">
            <Animated.Text entering={FadeIn.duration(600)} className="text-xl font-bold text-center mb-10">
                Give us a rating
            </Animated.Text>
            <Animated.View entering={FadeInDown.duration(600).delay(300)} className="flex-row justify-center items-center gap-8 mb-20">
                {[1, 2, 3, 4, 5].map((star, index) => {
                    const animatedStyle = useAnimatedStyle(() => {
                        return {
                            transform: [{ scale: animatedStars[index].value * 0.3 + 1 }],
                        };
                    });

                    const animatedColor = useAnimatedStyle(() => ({
                        backgroundColor: interpolateColor(
                            animatedStars[index].value,
                            [0,1],
                            ['transparent', 'transparent']
                        ),
                    }));
                    return (
                        <Animated.View key={star} entering={FadeInDown.duration(600).delay(300 + index * 100)}>
                            <Animated.View className="p-4" style={[animatedStyle]}>
                                <Animated.View style={animatedColor}>
                                    <Ionicons
                                        name={rating >= star ? 'star' : 'star-outline'}
                                        size={40}
                                        color={rating >= star ? "#FF9800" : "#D1D1D1"}
                                    />
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    );
                })}
            </Animated.View>
            <Animated.Text entering={FadeInDown.duration(600).delay(600)} className="text-lg text-center text-slate-500 leading-8">
                Made for poeple like you
            </Animated.Text>
            <Animated.View entering={FadeInDown.duration(600).delay(800)} className="flex-row justify-center items-center mt-10">
                <View className="w-15 h-15 rounded-md overflow-hidden">
                    <Animated.Image
                        source={require('@/assets/images/avatars/1.png')}
                        className="w-full h-full"
                        resizeMode='cover'
                    />
                </View>
                <View className="w-15 h-15 rounded-md overflow-hidden -ml-8">
                    <Animated.Image
                        source={require('@/assets/images/avatars/2.png')}
                        className="w-full h-full"
                        resizeMode='cover'
                    />
                </View>
                <View className="w-15 h-15 rounded-md overflow-hidden -ml-8">
                    <Animated.Image
                        source={require('@/assets/images/avatars/3.png')}
                        className="w-full h-full"
                        resizeMode='cover'
                    />
                </View>
                <View className="w-15 h-15 rounded-md overflow-hidden -ml-8">
                    <Animated.Image
                        source={require('@/assets/images/avatars/4.png')}
                        className="w-full h-full"
                        resizeMode='cover'
                    />
                </View>
            </Animated.View>
        </View>
    );
}