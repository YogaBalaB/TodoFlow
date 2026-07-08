import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { AppInput } from '../../components/AppInput';
import PasswordInput from '../../components/PasswordInput';
import { AppButton } from '../../components/AppButton';
import { FormCard } from '../../components/FormCard';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, error, clearError } = useAuth();
  const router = useRouter();

  const validateFields = () => {
    let valid = true;
    const trimmedEmail = email.trim();

    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setFormError(null);

    if (!trimmedEmail) {
      setEmailError('Email is required');
      valid = false;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Use at least 6 characters');
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    if (loading) {
      return;
    }

    clearError();
    setFormError(null);

    if (!validateFields()) {
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      router.replace('/(app)');
    } catch (err: any) {
      setFormError(err.message || 'Unable to create an account. Please try again.');
      console.log('Registration failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent as any} keyboardShouldPersistTaps="handled">
        <View style={styles.brandContainer}>
          <Text style={styles.logoText}>Todo<Text style={styles.logoAccent}>Flow</Text></Text>
          <Text style={styles.tagline}>Launch your productivity with a secure team workspace.</Text>
        </View>

        <FormCard
          title="Create your account"
          subtitle="Register once and access TodoFlow across all devices."
          style={styles.card}
        >

          {(formError || error) && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{formError || error}</Text>
            </View>
          )}

          <AppInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
              setFormError(null);
              clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError ?? undefined}
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
              setFormError(null);
              clearError();
            }}
            autoCapitalize="none"
            autoCorrect={false}
            error={passwordError ?? undefined}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError(null);
              setFormError(null);
              clearError();
            }}
            autoCapitalize="none"
            autoCorrect={false}
            error={confirmPasswordError ?? undefined}
          />

          <AppButton
            title={loading ? 'Creating account…' : 'Create account'}
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            variant="primary"
            style={styles.actionButton}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already registered?</Text>
            <TouchableOpacity
              onPress={() => {
                clearError();
                router.push('/(auth)/login');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </FormCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3fb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  logoAccent: {
    color: '#4f46e5',
  },
  tagline: {
    marginTop: 10,
    color: '#475569',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 36,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  footerLink: {
    marginLeft: 4,
    color: '#4338ca',
    fontSize: 14,
    fontWeight: '700',
  },
});
