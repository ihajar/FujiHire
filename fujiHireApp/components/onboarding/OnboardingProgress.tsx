import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  onBack,
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <View className="flex-row items-center p-4 gap-4">
      <TouchableOpacity
        onPress={onBack}
        className="p-2 roundeed-[120px] bg-[#f4f4f4]"
      >
        <Ionicons name="arrow-back" size={20} color={"#000000"} />
      </TouchableOpacity>
      <View className="flex-1 h-1 bg-[#E0E0E0] rounded-sm overflow-hidden">
        <View className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </View>
    </View>
  );
}
