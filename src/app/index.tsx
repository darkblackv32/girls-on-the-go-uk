import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;

export default function Landing() {
  const router = useRouter();
  const handleGetStarted = useCallback(() => {
    router.push('/signup');
  }, [router]);

  const handleSignIn = useCallback(() => {
    router.push('/auth');
  }, [router]);

  const logoStyle = useMemo(() => [
    styles.logo,
    isSmallDevice && styles.logoSmall,
    isMediumDevice && styles.logoMedium
  ], [isSmallDevice, isMediumDevice]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/fotos-premium/abstracto-foto-lineas-suaves-pantone-fondo-color-gradiente_558873-59527.jpg',
          }}
          style={styles.backgroundImage}
        >
          <Stack.Screen options={{ headerShown: false }} />
          
          <View style={styles.content}>
            <Image 
              source={require('../../assets/images/gotg-logo.png')}
              style={logoStyle}
              resizeMode="contain"
            />

            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome to Girls On The Go</Text>
              <Text style={styles.tagline}>Your new favorite community space</Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View style={styles.feature}>
                  <Ionicons name="people" size={24} color="#FF69B4" />
                  <Text style={styles.featureTitle}>Join a supportive community</Text>
                  <Text style={styles.featureDescription}>
                    Connect with like-minded individuals
                  </Text>
                </View>

                <View style={styles.feature}>
                  <Ionicons name="calendar" size={24} color="#FF69B4" />
                  <Text style={styles.featureTitle}>Discover exclusive events</Text>
                  <Text style={styles.featureDescription}>
                    Find events in your area
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.feature}>
                  <Ionicons name="gift" size={24} color="#FF69B4" />
                  <Text style={styles.featureTitle}>Earn rewards</Text>
                  <Text style={styles.featureDescription}>
                    Get rewarded for participation
                  </Text>
                </View>

                <View style={styles.feature}>
                  <Ionicons name="trophy" size={24} color="#FF69B4" />
                  <Text style={styles.featureTitle}>Save memories</Text>
                  <Text style={styles.featureDescription}>
                    Track your achievements
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.ctaSection}>
              <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity 
                  onPress={handleSignIn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signInLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
  },
  logo: {
    width: width * 0.95,
    height: height * 0.35,
    marginBottom: 10,
  },
  logoSmall: {
    width: width * 0.9,
    height: height * 0.3,
  },
  logoMedium: {
    width: width * 0.92,
    height: height * 0.32,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: Platform.select({
      ios: 24,
      android: 22,
      default: 24,
    }),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: Platform.select({
      ios: 14,
      android: 12,
      default: 14,
    }),
    color: '#000',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feature: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 10,
    color: '#666',
    lineHeight: 12,
    textAlign: 'center',
  },
  ctaSection: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  getStartedButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  signInText: {
    fontSize: 12,
    color: '#000',
  },
  signInLink: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
}); 