import React, { useRef, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch } from "@/store/hooks";
import { setOnboardingCompleted } from "@/store/slices/authSlice";
import { colors } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
}

const slides: Slide[] = [
  {
    id: "1",
    title: "Acceptez des courses",
    subtitle: "Gérez vos demandes de livraison en temps réel et augmentez vos revenus.",
    icon: "bicycle",
    iconColor: colors.primary,
  },
  {
    id: "2",
    title: "Navigation intégrée",
    subtitle: "Laissez-vous guider par notre carte interactive jusqu'au client.",
    icon: "map",
    iconColor: "#3B82F6",
  },
  {
    id: "3",
    title: "Preuve de livraison",
    subtitle: "Prenez une photo à l'arrivée pour confirmer la livraison en toute sécurité.",
    icon: "camera",
    iconColor: colors.success,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    dispatch(setOnboardingCompleted(true));
    router.replace("/login");
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: item.iconColor + "15" }]}>
            <Ionicons name={item.icon} size={100} color={item.iconColor} />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Commencer" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.dark,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#E5E7EB",
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
