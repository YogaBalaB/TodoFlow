import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  secureTextEntry,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null] as any}>
        <TextInput
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry}
          style={[styles.input, style]}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    width: '100%',
  },
  label: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    height: 54,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 16,
    height: '100%',
  },
  inputErrorBorder: {
    borderColor: '#fb7185',
    backgroundColor: '#fff1f2',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
});
