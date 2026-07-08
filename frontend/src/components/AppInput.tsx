import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rightElement?: React.ReactNode;
  rightElementStyle?: StyleProp<ViewStyle>;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  style,
  rightElement,
  rightElementStyle,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const isMultiline = !!props.multiline;
  

  return (
    <View style={[styles.container, containerStyle]}> 
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isMultiline ? styles.inputWrapperMultiline : null,
          focused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
      >
        <TextInput
          placeholderTextColor="#6B7280"
          secureTextEntry={props.secureTextEntry}
          style={[
            styles.input,
            isMultiline ? styles.inputMultiline : styles.inputSingle,
            inputStyle,
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightElement ? (
          <View style={[styles.rightElement, rightElementStyle]}>{rightElement}</View>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    minHeight: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  inputWrapperMultiline: {
    minHeight: 90,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  inputFocused: {
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  inputError: {
    borderColor: '#fb7185',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  inputSingle: {
    height: '100%',
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 6,
    paddingBottom: 12,
  },
  rightElement: {
    marginLeft: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 8,
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
  },
});
