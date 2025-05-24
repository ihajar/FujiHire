import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from "expo-haptics";
import { Text, View } from 'react-native';
import { PurchasesPackage } from "react-native-purchases";
import Animated, { FadeIn } from 'react-native-reanimated';
import { QUESTIONS } from './questions';
import LoadingScreen from './LoadingScreen';
import { RatingScreen } from './RatingScreen';

// import LogoDark from "../assets/images/logo-dark.png";

export function OnBoardingScreen() {
    const [ currentStep, setCurrentStep ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [subscriptionType, setSubscriptionType] = useState<'yearly' | 'monthly'>('yearly');
    const [packages, setPackages] = useState<{
        monthly?: PurchasesPackage;
        annual?: PurchasesPackage;
    }>({});

    const router = useRouter();

    const handleOptionSelect = (optionId: string) => {
        Haptics.selectionAsync();
        setAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
    };

    const handleContinue = async() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        Haptics.selectionAsync();
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStartFreeTrial = async() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCurrentStep(currentStep + 1);
    };

    const handleSubscriptionSelect = (type: 'yearly' | 'monthly') => {
        Haptics.selectionAsync();
        setSubscriptionType(type);
    };

    const handlePurchasePackage = async() => {
        if(subscriptionType === 'yearly') {
            if (packages.annual) {
                const sucess = true;
                if (sucess) {
                    router.replace('/(tabs)');
                }
            }
        } else {
            if(packages.monthly) {
                const success = true;
                if (success) {
                    router.replace('/(tabs)')
                }
            }
        }
    };

    const renderContent = () => {
        if(currentStep === 0) {
            return (
                <Animated.View entering={FadeIn.duration(600)} className="flex-1 justify-center items-center p-4">
                    <Animated.Image
                        entering={FadeIn.duration(600)}
                        source={require('@/assets/images/logo-dark.svg')}
                        className="w-26 h-26 mb-4"
                        resizeMode="contain"
                    />
                    <Text className='text-3xl font-bold text-center mb-8 text-white'>Welcome to FujiHire</Text>
                    <Text className='text-xl text-center text-slate-300 leading-[26px] mb-10'>
                        We are excited to have you on board! Let's get started with a few quick questions to tailor your experience.
                    </Text>
                </Animated.View>
            );
        }
        if (currentStep === QUESTIONS.length +1) {
            return <RatingScreen />;
        }
         if (currentStep === QUESTIONS.length +2) {
            return <LoadingScreen onTimeout={handleContinue} />
        }
    }

  return (
    <View>
      <Text>OnBoardingScreen</Text>
    </View>
  )
}