import { useEffect, useState } from "react";
import { View, SafeAreaView, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";
import Animated, { FadeIn, FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";


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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <Animated.Text
                    entering={FadeIn.duration(600)}
                    style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: 40,
                    }}
                >
                    Give us a rating
                </Animated.Text>
                <Animated.View
                    entering={FadeInDown.duration(600).delay(300)}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 40,
                    }}
                >
                    {[1, 2, 3, 4, 5].map((star, index) => {
                        const animatedStyle = useAnimatedStyle(() => {
                            return {
                                transform: [{ scale: animatedStars[index].value * 0.3 + 1 }],
                            };
                        });

                        const animatedColor = useAnimatedStyle(() => ({
                            backgroundColor: interpolateColor(
                                animatedStars[index].value,
                                [0, 1],
                                ['transparent', 'transparent']
                            ),
                        }));
                        return (
                            <Animated.View key={star} entering={FadeInDown.duration(600).delay(300 + index * 100)}>
                                <Animated.View style={[{ padding: 8 }, animatedStyle]}>
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
                <Animated.Text
                    entering={FadeInDown.duration(600).delay(600)}
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: '#334155',
                    }}
                >
                    Made for poeple like you
                </Animated.Text>
                <Animated.View
                    entering={FadeInDown.duration(600).delay(800)}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        overflow: 'hidden',
                    }}>
                        <Animated.Image
                            source={require('@/assets/images/avatars/1.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        overflow: 'hidden',
                        marginLeft: -32,
                    }}>
                        <Animated.Image
                            source={require('@/assets/images/avatars/2.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        overflow: 'hidden',
                        marginLeft: -32,
                    }}>
                        <Animated.Image
                            source={require('@/assets/images/avatars/3.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        overflow: 'hidden',
                        marginLeft: -32,
                    }}>
                        <Animated.Image
                            source={require('@/assets/images/avatars/4.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='cover'
                        />
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}