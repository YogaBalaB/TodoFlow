import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  compact = false,
  style,
}) => {
  const primary = variant === 'primary';
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled || loading ? styles.buttonDisabled : null,
        compact ? styles.compactButton : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? '#ffffff' : '#1f2937'} size="small" />
      ) : (
        <Text style={[styles.buttonText, primary ? styles.primaryText : styles.secondaryText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    cursor: 'pointer',
  },
  compactButton: {
    width: 'auto',
    minWidth: 110,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.16)',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonDisabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.15,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#0f172a',
  },
});
