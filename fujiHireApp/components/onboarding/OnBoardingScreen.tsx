import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity, View } from "react-native";
import { PurchasesPackage } from "react-native-purchases";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { QUESTIONS } from "./questions";
import LoadingScreen from "./LoadingScreen";
import { RatingScreen } from "./RatingScreen";
import { TrialFeatures } from "./TrialFeatures";
import { TrialReminder } from "./TrialReminder";
import { SubscriptionScreen } from "./SubscriptionScreen";
import { OnboardingProgress } from "./OnboardingProgress";

// import LogoDark from "../assets/images/logo-dark.png";

const TOTAL_STEPS = QUESTIONS.length + 6;

interface Option {
  id: string;
  label: string;
}

export function OnBoardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [subscriptionType, setSubscriptionType] = useState<
    "yearly" | "monthly"
  >("yearly");
  const [packages, setPackages] = useState<{
    monthly?: PurchasesPackage;
    annual?: PurchasesPackage;
  }>({});

  const router = useRouter();

  const handleOptionSelect = (optionId: string) => {
    Haptics.selectionAsync();
    setAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    Haptics.selectionAsync();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartFreeTrial = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(currentStep + 1);
  };

  const handleSubscriptionSelect = (type: "yearly" | "monthly") => {
    Haptics.selectionAsync();
    setSubscriptionType(type);
  };

  const handlePurchasePackage = async () => {
    if (subscriptionType === "yearly") {
      if (packages.annual) {
        const sucess = true;
        if (sucess) {
          router.replace('/(protected)/(tabs)');
        }
      }
    } else {
      if (packages.monthly) {
        const success = true;
        if (success) {
          router.replace('/(protected)/(tabs)');
        }
      }
    }
  };

  const handleGoToAuth = () => {
    router.replace('/(protected)/login'); // This is where you use the "/auth" link
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return (
        <Animated.View
          entering={FadeIn.duration(600)}
          className="flex-1 justify-center items-center p-8"
        >
          <Animated.Image
            entering={FadeIn.duration(600)}
            source={require("@/assets/images/onBoarding-illus.png")}
            className="w-full h-[300px] mb-2"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold font-rametto text-center mb-3 text-black">
            Welcome to <Text className="text-secondary">Career++</Text>
          </Text>
          <Text className="text-xl text-center mb-3">
            We are excited to have you on board! Let's get started with a few
            quick questions to tailor your experience.
          </Text>
        </Animated.View>
      );
    }
    if (currentStep === QUESTIONS.length + 1) {
      return <RatingScreen />;
    }
    if (currentStep === QUESTIONS.length + 2) {
      return <LoadingScreen onTimeout={handleContinue} />;
    }
    if (currentStep === QUESTIONS.length + 3) {
      return (
        <TrialFeatures
          yearlyPrice="100$"
          yearlyTotal="12000$"
          onStartFreeTrial={handleStartFreeTrial}
        />
      );
    }

    if (currentStep === QUESTIONS.length + 4) {
      return (
        <TrialReminder
          yearlyPrice="100$"
          yearlyTotal="12000$"
          onStartFreeTrial={handleStartFreeTrial}
        />
      );
    }

    if (currentStep === QUESTIONS.length + 5) {
      return (
        <SubscriptionScreen
          subscriptionType={subscriptionType}
          monthlyPrice="10$"
          yearlyPrice="100$"
          yearlyTotal="120$"
          yearlyMonthlyPrice="8.33$"
          onSubscriptionSelect={handleSubscriptionSelect}
          onPurchasePackage={handlePurchasePackage}
          onRestorePurchases={() => {}}
          onGoToAuth={handleGoToAuth}
        />
      );
    }

    const currentQuestion = QUESTIONS[currentStep - 1];
    if (!currentQuestion) return null;

    return (
      <View>
        <Animated.Text>{currentQuestion.question}</Animated.Text>
        {currentQuestion.options.map((option: Option, index: number) => (
          <Animated.View
            key={option.id}
            entering={FadeInDown.duration(600).delay(index * 100)}
          >
            <TouchableOpacity
              onPress={() => handleOptionSelect(option.id)}
              className={`p-4 rounded-xl mt-3 border-2 border-transparent
                                ${answers[currentStep] === option.id} 
                                bg-primary/10 border-primary/5
                            `}
            >
              <Text
                className={`text-base text-center font-medium 
                                    ${answers[currentStep] === option.id} 
                                    text-primary font-semibold
                                `}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    );
  };

  const shouldShowProgress = currentStep > 0 && currentStep <= QUESTIONS.length;
  const isWelcomeScreen = currentStep === 0;

  return (
    <View className="flex-1 bg-white p-4">
      {shouldShowProgress && (
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={QUESTIONS.length}
          onBack={handleBack}
        />
      )}
      {renderContent()}
      {currentStep <= QUESTIONS.length + 2 && (
        <Animated.View entering={FadeIn.duration(600)}>
          <TouchableOpacity
            className={`bg-primary p-4 mt-8 rounded-xl items-center justify-center 
                  ${currentStep > 0 && currentStep <= QUESTIONS.length && !answers[currentStep] ? 'opacity-0.5' : null }
              `}
            onPress={handleContinue}
            disabled={currentStep > 0 && currentStep <= QUESTIONS.length && !answers[currentStep]}
          >
            <Text className="text-white text-lg font-semibold">
              {isWelcomeScreen ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
