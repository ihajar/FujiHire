import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface TrialFeaturesProps {
    yearlyPrice: string;
    yearlyTotal: string;
    onStartFreeTrial: () => void;
}

export function TrialFeatures({ yearlyPrice, yearlyTotal, onStartFreeTrial }: TrialFeaturesProps) {
    return (
        <View className="flex-1 bg-white">
            <View className="flex-1">
                <Animated.View entering={FadeIn.duration(600)} className="items-center p-16 pb-0">
                    <Text className="text-xl font-bold text-center mb-20 text-black">
                        We want you to try FujiHire for free.
                    </Text>
                    <View className="w-full h-56 mb-10">
                        <Image
                            source={require('@/assets/images/logo-light.svg')}
                        />
                    </View>
                </Animated.View>
            </View>
            <View className="p-10 pb-0 bg-white border-t-2 border-t-slate-300">
                <View className="items-center mb-12">
                    <Text className="text-lg text-center mb-4 text-black">
                        ✓ No Payment Due Now
                    </Text>
                    <Text className="text-lg text-center text-slate-700">
                        Just {yearlyTotal} per year ({yearlyPrice}/ mo)
                    </Text>
                </View>
                <TouchableOpacity className="p-8 m-5 rounded-md items-center" onPress={onStartFreeTrial}>
                    <Text className="text-white text-lg font-semibold">
                        Try for $0.00
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}