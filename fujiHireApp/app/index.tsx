import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function OnboardingScreen() {
    return (
        <View className="flex-1, justify-center">
            <Text className="text-xl mb-7">Welcome to FujiHire!</Text>
            <Link href="/" asChild>
                <Button title="Log In"/>
            </Link>
            <View className="h-4">
                <Link href="/" asChild>
                    <Button title="Sign Up" />
                </Link>
            </View>
        </View>
    )
}