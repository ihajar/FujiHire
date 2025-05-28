import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

interface SubscriptionScreenProps {
  subscriptionType: "yearly" | "monthly";
  monthlyPrice: string;
  yearlyPrice: string;
  yearlyTotal: string;
  yearlyMonthlyPrice: string;
  onSubscriptionSelect: (type: "yearly" | "monthly") => void;
  onPurchasePackage: () => void;
  onRestorePurchases: () => void;
  onGoToAuth: () => void; // Add this prop
}

export function SubscriptionScreen({
  subscriptionType,
  monthlyPrice,
  yearlyTotal,
  yearlyMonthlyPrice,
  onSubscriptionSelect,
  onPurchasePackage,
  onRestorePurchases,
  onGoToAuth, // Add this prop
}: SubscriptionScreenProps) {
  const handleTerms = () => {
    Linking.openURL("https://healthy-swap.netlify.app/terms");
  };
  const handlePrivacy = () => {
    Linking.openURL("https://healthy-swap.netlify.app/privacy");
  };

  return (
    <View className="flex-1 bg-white">
      <Animated.View
        entering={FadeIn.duration(600)}
        className="flex-1 p-6 pt-10"
      >
        <Text className="text-4xl font-bold text-center mb-8 text-black">
          {subscriptionType === "yearly"
            ? "Start your 3-day FREE trial to continue."
            : "Unlock FujiHire for your advantages."}
        </Text>
        <Animated.ScrollView
          entering={FadeInDown.duration(600).delay(300)}
          className="mb-8"
        >
          {subscriptionType === "yearly" && (
            <>
              <View className="flex-row items-start mb-2.5">
                <View className="w-10 h-10 rounded-[20px] justify-center items-center mr-4">
                  <Ionicons name="lock-open" size={24} color="#EC3E72" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold mb-1">Today</Text>
                  <Text className="text-sm text-slate-500">
                    Unlock all the app's features.
                  </Text>
                </View>
              </View>
              <View className="bg-secondary w-0.5 h-6 ml-4.5 mb-6" />
              <View className="flex-row items-start mb-3">
                <View className="w-10 h-10 rounded-[20px] justify-center items-center mr-4">
                  <Ionicons name="notifications" size={24} color="#EC3E72" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold mb-1">
                    In 2 Days - Reminder
                  </Text>
                  <Text className="text-sm text-slate-500">
                    We'll send you a reminder that your trial is ending soon.
                  </Text>
                </View>
              </View>
              <View className="bg-secondary w-0.5 h-6 ml-4.5 mb-6"/>
              <View className="flex-row items-start mb-3">
                <View className="w-10 h-10 rounded-[20px] justify-center items-center mr-4">
                  <Ionicons name="card" size={24} color="#EC3E72" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold mb-1">
                    In 3 Days - Billing Starts
                  </Text>
                  <Text className="text-sm text-slate-500">
                    You'll be charged {yearlyTotal} unless you cancel anytime before.
                  </Text>
                </View>
              </View>
            </>
          )}
          {subscriptionType === 'monthly' && (
            <>
                <View className="mb-6">
                    <Text className="text-base font-bold mb-1">✓ Discover the best</Text>
                    <Text className="text-sm text-gray-500">
                        Explore a wide range of remote job opportunities tailored to your skills and interests.
                    </Text>
                </View>
                <View className="mb-6">
                    <Text className="text-base font-bold mb-1">✓ Talent Hanting made easy</Text>
                    <Text className="text-sm text-gray-500">
                        Get Access to top talent and hire the best candidates for your team.
                    </Text>
                </View>
                <View className="mb-6">
                    <Text className="text-base font-bold mb-1">✓ Land your dream job with AI</Text>
                    <Text className="text-sm text-gray-500">
                        Get started with AI-powered job matching and personalized recommendations.
                    </Text>
                </View>
            </>
          )}
        </Animated.ScrollView>
      </Animated.View>

      <View className="p-5 pb-0 bg-white border-t-0.5 border-t-slate-300" >
        <View className="items-center mb-6">
            <Text className="text-base font-medium mb-2">
                {subscriptionType === 'yearly'
                    ? '✓ No Payment Due Now'
                    : '✓ No Commitment - Cancel Anytime'
                }
            </Text>
            {subscriptionType === 'yearly' && (
                <Text className="text-base text-center text-slate-500">
                    {`3 days free, then ${yearlyTotal}/ year (${yearlyMonthlyPrice}/ mo)`}
                </Text>
            )}
        </View>
        <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
                className={`flex-1 p-4 rounded-xl border-2 items-center ${
                    subscriptionType === 'monthly'
                        ? 'border-secondary/15 bg-orange-50'
                        : 'border-slate-300 bg-white'
                }`}
                onPress={() => onSubscriptionSelect('monthly')}
            >
                <Text className="text-base font-semibold mb-1">Monthly </Text>
                <Text className="text-sm text-gray-600">{monthlyPrice}</Text>
            </TouchableOpacity>
                        <TouchableOpacity
                className={`flex-1 p-4 rounded-xl border-2 items-center ${
                    subscriptionType === 'yearly'
                        ? 'border-secondary bg-orange-50'
                        : 'border-slate-300 bg-white'
                }`}
                onPress={() => onSubscriptionSelect('yearly')}
            >
                <View>
                    <Text className="text-base font-semibold mb-1">Yearly</Text>
                    <Text className="text-sm text-gray-600">{yearlyTotal}</Text>
                </View>
                {subscriptionType === 'yearly' && (
                    <View className="absolute -top-3 px-2 py-1 bg-black rounded-md">
                        <Text className="text-white text-xs font-bold">3 DAYS FREE</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
        <TouchableOpacity className="p-4 m-2.5 rounded-xl items-center" onPress={onPurchasePackage}>
            <Text className="text-white text-lg font-semibold">
                {subscriptionType === 'yearly' ? 'Start My 3-Day Free Trial' : 'Start FujiHire'}
            </Text>
        </TouchableOpacity>

        <View className="flex-row justify-evenly items-center mt-0 mb-2.5">
            <TouchableOpacity onPress={onRestorePurchases}>
                <Text className="text-sm underline text-gray-500">Restore Purchases</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTerms}>
                <Text className="text-sm underline text-gray-500">RTerms</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrivacy}>
                <Text className="text-sm underline text-gray-500">Privacy</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="p-3 mt-2 rounded-xl items-center border border-slate-300 bg-primary"
          onPress={onGoToAuth}
        >
          <Text className="text-base font-semibold text-white">
            Login / Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
