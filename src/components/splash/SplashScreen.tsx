import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme";

export default function Splashscreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
    });

    scale.value = withTiming(1, {
      duration: 1000,
    });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          animatedLogoStyle,
        ]}
      >
        <Text style={styles.brandName}>
          Togo
          <Text style={{ color: colors.primary }}>
            Express
          </Text>
        </Text>

        <Text style={styles.tagline}>
          Livreurs Partenaires
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
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