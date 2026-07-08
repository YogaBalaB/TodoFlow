import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function AppLayout() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/(auth)/login');
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // If token doesn't exist, we will be redirected by useEffect, so return null
  if (!token) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f172a' } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
