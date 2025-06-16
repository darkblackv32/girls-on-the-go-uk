import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Toast } from 'react-native-toast-notifications';
import { useAuth } from '../providers/auth-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;

const authSchema = zod.object({
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

type AuthFormData = zod.infer<typeof authSchema>;

export default function Auth() {
  const { session } = useAuth();
  const router = useRouter();

  if (session) return <Redirect href='/' />;

  const { control, handleSubmit, formState } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const signIn = useCallback(async (data: AuthFormData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      
      Toast.show('Signed in successfully', {
        type: 'success',
        placement: 'top',
        duration: 1500,
      });
    } catch (error: any) {
      Toast.show(error.message || 'An error occurred during sign in', {
        type: 'error',
        placement: 'top',
        duration: 3000,
      });
    }
  }, []);

  const signUp = useCallback(async (data: AuthFormData) => {
    try {
      const { error } = await supabase.auth.signUp(data);
      if (error) throw error;
      
      Toast.show('Signed up successfully', {
        type: 'success',
        placement: 'top',
        duration: 1500,
      });
    } catch (error: any) {
      Toast.show(error.message || 'An error occurred during sign up', {
        type: 'error',
        placement: 'top',
        duration: 3000,
      });
    }
  }, []);

  const handleSocialAuth = useCallback((provider: string) => {
    Toast.show(`${provider} authentication will be implemented soon`, {
      type: 'info',
      placement: 'top',
      duration: 2000,
    });
  }, []);

  const handleForgotPassword = useCallback(() => {
    Toast.show('Password reset will be implemented soon', {
      type: 'info',
      placement: 'top',
      duration: 2000,
    });
  }, []);

  const handleSignUp = useCallback(() => {
    router.push('/signup');
  }, [router]);

  const logoStyle = useMemo(() => [
    styles.logo,
    isSmallDevice && styles.logoSmall,
    isMediumDevice && styles.logoMedium
  ], [isSmallDevice, isMediumDevice]);

  const contentContainerStyle = useMemo(() => [
    styles.contentContainer,
    isSmallDevice && styles.contentContainerSmall,
    isMediumDevice && styles.contentContainerMedium
  ], [isSmallDevice, isMediumDevice]);

  return (
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image 
            source={require('../../assets/images/gotg-logo.png')}
            style={logoStyle}
            resizeMode="contain"
          />
          
          <View style={contentContainerStyle}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to Girls on the Go</Text>

            <Controller
              control={control}
              name='email'
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <>
                  <Text style={styles.inputLabel}>Email or Phone</Text>
                  <TextInput
                    placeholder='Enter your email or phone'
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor='rgba(0, 0, 0, 0.5)'
                    autoCapitalize='none'
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!formState.isSubmitting}
                  />
                  {error && <Text style={styles.error}>{error.message}</Text>}
                </>
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    placeholder='Enter your password'
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    placeholderTextColor='rgba(0, 0, 0, 0.5)'
                    autoCapitalize='none'
                    autoComplete="password"
                    textContentType="password"
                    editable={!formState.isSubmitting}
                  />
                  {error && <Text style={styles.error}>{error.message}</Text>}
                </>
              )}
            />

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signInButton, formState.isSubmitting && styles.signInButtonDisabled]}
              onPress={handleSubmit(signIn)}
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>Or continue with</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth('Google')}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth('Apple')}
                >
                  <Ionicons name="logo-apple" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth('WhatsApp')}
                >
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
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
    padding: 16,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.3,
    marginBottom: 60,
    marginTop: -50,
  },
  logoSmall: {
    width: width * 0.8,
    height: height * 0.25,
    marginTop: -70,
    marginBottom: 50,
  },
  logoMedium: {
    width: width * 0.85,
    height: height * 0.27,
    marginTop: -5,
    marginBottom: 55,
  },
  subtitle: {
    fontSize: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: 0,
  },
  contentContainerSmall: {
    maxWidth: width * 0.9,
    marginTop: -5,
  },
  contentContainerMedium: {
    maxWidth: width * 0.95,
    marginTop: -75,
  },
  welcomeText: {
    fontSize: Platform.select({
      ios: 28,
      android: 26,
      default: 28,
    }),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    padding: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    fontSize: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
    color: '#000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputError: {
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 4,
  },
  forgotPasswordText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  socialContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  socialText: {
    color: '#000',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: Platform.select({
      ios: 50,
      android: 45,
      default: 50,
    }),
    height: Platform.select({
      ios: 50,
      android: 45,
      default: 50,
    }),
    borderRadius: Platform.select({
      ios: 25,
      android: 22.5,
      default: 25,
    }),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  signUpText: {
    color: '#000',
    fontSize: 14,
  },
  signUpLink: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'left',
    width: '100%',
    fontWeight: '500',
  },
  inputLabel: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});
