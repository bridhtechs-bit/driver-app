import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from "react-native-reanimated";
import { colors } from "@/theme";
import { useAppSelector } from "@/store/hooks";

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  
  const { isAuthenticated, onboardingCompleted } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 1. Logo fade-in and scale animation
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1000 }, () => {
      // 2. Wait a bit then route on JS thread
      runOnJS(handleNavigation)();
    });
  }, []);

  const handleNavigation = () => {
    // Delay routing for 1 second after animation completes (total 2s)
    setTimeout(() => {
      if (!onboardingCompleted) {
        router.replace("/onboarding");
      } else if (!isAuthenticated) {
        router.replace("/login");
      } else {
        router.replace("/(app)");
      }
    }, 1000);
  };

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <Text style={styles.brandName}>
          Togo<Text style={{ color: colors.primary }}>Express</Text>
        </Text>
        <Text style={styles.tagline}>Livreurs Partenaires</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111", // Fond sombre pour le splash
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  brandName: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
