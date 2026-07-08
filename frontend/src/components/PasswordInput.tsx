import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput } from './AppInput';

interface PasswordInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <AppInput
        label={label}
        error={error}
        secureTextEntry={!visible}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setVisible((v) => !v)}
            accessible
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          >
            <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
          </TouchableOpacity>
        }
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default PasswordInput;
