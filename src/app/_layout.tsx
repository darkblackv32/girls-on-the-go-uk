import { Stack } from 'expo-router';
import { ToastProvider } from 'react-native-toast-notifications';
import AuthProvider from '../providers/auth-provider';
import QueryProvider from '../providers/query-provider';
import NotificationProvider from '../providers/notification-provider';

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <QueryProvider>
          <NotificationProvider>
            <Stack>
              <Stack.Screen name='main' options={{ headerShown: false }} />
              <Stack.Screen name='auth' options={{ headerShown: false }} />
              <Stack.Screen name='signup' options={{ headerShown: false }} />
              <Stack.Screen name='verify' options={{ headerShown: false }} />
            </Stack>
          </NotificationProvider>
        </QueryProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
