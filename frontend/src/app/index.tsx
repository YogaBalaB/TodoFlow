import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (token) {
      router.replace('/(app)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [token, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
