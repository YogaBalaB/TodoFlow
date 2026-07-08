import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        disabled || loading ? styles.buttonDisabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    backgroundColor: '#4338ca',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4338ca',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 5,
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(67, 56, 202, 0.18)',
  },
  buttonDisabled: {
    backgroundColor: '#c7d2fe',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
