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
  AccessibilityInfo,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, Stack, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Toast } from 'react-native-toast-notifications';
import { useAuth } from '../providers/auth-provider';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

// Constants
const COLORS = {
  primary: '#000',
  error: '#d32f2f',
  text: '#000',
  textSecondary: '#666',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'rgba(0, 0, 0, 0.1)',
};

const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;

const signupSchema = zod.object({
  fullName: zod.string().min(2, { message: 'Full name is required' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  agreeToTerms: zod.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type SignupFormData = zod.infer<typeof signupSchema>;

const authSchema = zod.object({
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

type AuthFormData = zod.infer<typeof authSchema>;

export default function Signup() {
  const { session } = useAuth();
  const router = useRouter();

  //if (session) return <Redirect href='/' />;

  const { control, handleSubmit, formState } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
    mode: 'onChange',
  });    const signUp = useCallback(async (data: SignupFormData) => {
    try {
      console.log('Signing up with data:', {
        email: data.email,
        name: data.fullName,
        agreeToTerms: data.agreeToTerms
      });
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            agreeToTerms: data.agreeToTerms
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup successful, user:', authData?.user?.id);
      
      Toast.show('Signed up successfully! Please check your email for verification.', {
        type: 'success',
        placement: 'top',
        duration: 3000,
      });
      
      // Navigate to verification page after successful signup
      router.push('/verify');
      
    } catch (error: any) {
      console.error('Error details:', error);
      Toast.show(error.message || 'An error occurred during sign up', {
        type: 'error',
        placement: 'top',
        duration: 3000,
      });
    }
  }, [router]);
    
  // const signUp = useCallback(async (data: SignupFormData) => {
  //   try {
  //     // Temporarily bypass Supabase auth HARDCODEADO
  //     console.log('Bypassing auth, navigating to verification...');
  //     router.push('/verify');
  //   } catch (error: any) {
  //     Toast.show(error.message || 'An error occurred during sign up', {
  //       type: 'error',
  //       placement: 'top',
  //       duration: 3000,
  //     });
  //   }
  // }, [router]);

  const handleSocialAuth = useCallback(async (provider: string) => {
    try {
      Toast.show(`${provider} authentication will be implemented soon`, {
        type: 'info',
        placement: 'top',
        duration: 2000,
      });
    } catch (error: any) {
      Toast.show(error.message || 'Authentication failed', {
        type: 'error',
        placement: 'top',
        duration: 3000,
      });
    }
  }, []);

  const handleLogin = useCallback(() => {
    router.push('/auth');
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
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image 
            source={require('../../assets/images/gotg-logo.png')}
            style={logoStyle}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Girls on the Go logo"
          />
          
          <View style={contentContainerStyle}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Girls on the Go community</Text>

            <Controller
              control={control}
              name='fullName'
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    placeholder='Enter your full name'
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor='rgba(0, 0, 0, 0.5)'
                    autoCapitalize='words'
                    editable={!formState.isSubmitting}
                    accessible={true}
                    accessibilityLabel="Full name input"
                    accessibilityHint="Enter your full name"
                  />
                  {error && (
                    <Text 
                      style={styles.error}
                      accessible={true}
                      accessibilityRole="alert"
                    >
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name='email'
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    placeholder='Enter your email'
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
                    accessible={true}
                    accessibilityLabel="Email input"
                    accessibilityHint="Enter your email address"
                  />
                  {error && (
                    <Text 
                      style={styles.error}
                      accessible={true}
                      accessibilityRole="alert"
                    >
                      {error.message}
                    </Text>
                  )}
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
                    accessible={true}
                    accessibilityLabel="Password input"
                    accessibilityHint="Enter your password"
                  />
                  <Text style={styles.passwordHint}>Password must be at least 8 characters</Text>
                  {error && (
                    <Text 
                      style={styles.error}
                      accessible={true}
                      accessibilityRole="alert"
                    >
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name='agreeToTerms'
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <View style={styles.termsContainer}>
                  <View style={styles.termsRow}>
                    <Checkbox
                      value={value}
                      onValueChange={onChange}
                      style={styles.checkbox}
                      color={value ? COLORS.primary : undefined}
                      accessible={true}
                      accessibilityLabel="Terms and conditions checkbox"
                      accessibilityHint="Agree to terms and conditions"
                    />
                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text style={styles.termsLink}>Terms of Service</Text>
                      {' '}and{' '}
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                  </View>
                  {error && (
                    <Text 
                      style={styles.error}
                      accessible={true}
                      accessibilityRole="alert"
                    >
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity
              style={[styles.signUpButton, formState.isSubmitting && styles.signUpButtonDisabled]}
              onPress={handleSubmit(signUp)}
              disabled={formState.isSubmitting}
              accessible={true}
              accessibilityLabel="Sign up button"
              accessibilityHint="Create your account"
              accessibilityRole="button"
              accessibilityState={{ disabled: formState.isSubmitting }}
            >
              {formState.isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialAuth('Google')}
                accessible={true}
                accessibilityLabel="Continue with Google"
                accessibilityRole="button"
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialAuth('Apple')}
                accessible={true}
                accessibilityLabel="Continue with Apple"
                accessibilityRole="button"
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity 
                onPress={handleLogin}
                accessible={true}
                accessibilityLabel="Log in"
                accessibilityRole="link"
              >
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.legalText}>
              By signing up, you agree to our{' '}
              <Text style={styles.legalLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Text>
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
    padding: SPACING.medium,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.3,
    marginBottom: 40,
    marginTop: -50,
  },
  logoSmall: {
    width: width * 0.8,
    height: height * 0.25,
    marginTop: -70,
    marginBottom: 30,
  },
  logoMedium: {
    width: width * 0.85,
    height: height * 0.27,
    marginTop: -5,
    marginBottom: 35,
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
      ios: 32,
      android: 30,
      default: 32,
    }),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.small,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
    color: COLORS.text,
    marginBottom: SPACING.large,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    width: '100%',
    padding: Platform.select({
      ios: SPACING.medium,
      android: SPACING.medium - 2,
      default: SPACING.medium,
    }),
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    fontSize: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  inputLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.small,
    alignSelf: 'flex-start',
  },
  passwordHint: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: -12,
    marginBottom: SPACING.medium,
    alignSelf: 'flex-start',
  },
  termsContainer: {
    width: '100%',
    marginBottom: SPACING.large,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: SPACING.small,
  },
  termsText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  termsLink: {
    color: COLORS.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.large,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.large,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  separatorText: {
    color: COLORS.text,
    marginHorizontal: SPACING.medium,
    fontSize: 14,
  },
  socialContainer: {
    width: '100%',
    gap: SPACING.small + 4,
    marginBottom: SPACING.large,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.small + 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: SPACING.small + 4,
  },
  socialButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  loginText: {
    color: COLORS.text,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  legalText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  legalLink: {
    color: COLORS.text,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: SPACING.medium,
    textAlign: 'left',
    width: '100%',
    fontWeight: '500',
  },
}); 