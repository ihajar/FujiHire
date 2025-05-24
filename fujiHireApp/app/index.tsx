import { OnBoardingScreen } from "@/components/onboarding/OnBoardingScreen";
import { SafeAreaView } from "react-native";

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-[#4B0066] text-white">
            <OnBoardingScreen />
        </SafeAreaView>
    )
}