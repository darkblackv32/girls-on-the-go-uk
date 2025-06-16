import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'react-native-toast-notifications';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function VerifyEmail() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get stored email from AsyncStorage when component mounts
    AsyncStorage.getItem('verificationEmail').then(storedEmail => {
      if (storedEmail) {
        setEmail(storedEmail);
      }
    });
  }, []);

  const handleResendEmail = useCallback(async () => {
    if (!email) {
      Toast.show('Email address not found. Please go back and sign up again.', {
        type: 'error',
        placement: 'top',
        duration: 3000,
      });
      return;
    }

    try {
      setIsResending(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || 'com.gotg.mobile://auth/callback'
        }
      });
      
      if (error) throw error;
      
      Toast.show('Verification email has been resent. Please check your inbox.', {
        type: 'success',
        placement: 'top',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      Toast.show(error.message || 'Failed to resend verification email. Please try again.', {
        type: 'error',
        placement: 'top',
        duration: 3000,
      });
    } finally {
      setIsResending(false);
    }
  }, [email]);

  const handleBackToLogin = useCallback(() => {
    router.replace('/auth');
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://img.freepik.com/fotos-premium/abstracto-foto-lineas-suaves-pantone-fondo-color-gradiente_558873-59527.jpg',
        }}
        style={styles.backgroundImage}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../assets/images/gotg-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={64} color="#1BC464" />
              </View>
              
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.description}>
                We've sent a verification link to {email ? <Text style={styles.emailHighlight}>{email}</Text> : 'your email address'}. Please check your inbox and click the link to complete your registration.
              </Text>
              
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
                <Text style={styles.infoText}>
                  If you don't see the email in your inbox, please check your spam folder.
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.resendButton, isResending && styles.resendButtonDisabled]} 
                onPress={handleResendEmail}
                activeOpacity={0.8}
                disabled={isResending}
              >
                {isResending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>Resend Verification Email</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackToLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.2,
    marginVertical: 30,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: 'rgba(27, 196, 100, 0.1)',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Platform.select({
      ios: 24,
      android: 22,
      default: 24,
    }),
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: '#1BC464',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    height: 50,
    justifyContent: 'center',
  },
  resendButtonDisabled: {
    backgroundColor: '#93e0b5',
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  emailHighlight: {
    fontWeight: 'bold',
    color: '#1BC464',
  },
});
