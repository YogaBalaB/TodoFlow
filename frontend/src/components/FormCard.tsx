import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface FormCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  children,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 36,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 24,
  },
});
