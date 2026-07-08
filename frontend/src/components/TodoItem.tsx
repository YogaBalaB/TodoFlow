import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority?: 'Low' | 'Medium' | 'High';
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string, title?: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={[styles.card, todo.completed ? styles.cardCompleted : null]}>
      {/* Complete Checkbox */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onToggle(todo._id, !todo.completed)}
        style={styles.checkButton}
      >
        <View style={[styles.checkbox, todo.completed ? styles.checkboxChecked : null]}>
          {todo.completed && <Ionicons name="checkmark" size={16} color="#ffffff" />}
        </View>
      </TouchableOpacity>

      {/* Todo Contents */}
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, todo.completed ? styles.titleCompleted : null]} numberOfLines={1}>
            {todo.title}
          </Text>
          {todo.priority ? (
            <View style={[
              styles.prioritySmall,
              todo.priority === 'Low' ? styles.priorityLow : null,
              todo.priority === 'Medium' ? styles.priorityMedium : null,
              todo.priority === 'High' ? styles.priorityHigh : null,
              styles.priorityAfter,
            ]}>
              <Text style={[
                styles.prioritySmallText,
                todo.priority === 'Low' ? styles.priorityTextLow : null,
                todo.priority === 'Medium' ? styles.priorityTextMedium : null,
                todo.priority === 'High' ? styles.priorityTextHigh : null,
              ]}>{todo.priority}</Text>
            </View>
          ) : null}
        </View>
        {todo.description ? (
          <Text style={[styles.description, todo.completed ? styles.descriptionCompleted : null]}>
            {todo.description}
          </Text>
        ) : null}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => onEdit(todo)}
          style={styles.actionIconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={18} color="#cbd5e1" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(todo._id, todo.title)}
          style={styles.actionIconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.8,
    backgroundColor: '#FFFFFF',
  },
  checkButton: {
    marginRight: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityAfter: {
    marginLeft: 8,
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  titleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  description: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },
  descriptionCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  prioritySmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  prioritySmallText: {
    fontSize: 11,
    fontWeight: '700',
  },
  /* Low: light green background, dark green text */
  priorityLow: {
    backgroundColor: '#D1FAE5',
  },
  priorityTextLow: {
    color: '#065F46',
  },
  /* Medium: light orange background, orange text */
  priorityMedium: {
    backgroundColor: '#FFF7ED',
  },
  priorityTextMedium: {
    color: '#C2410C',
  },
  /* High: light red background, red text */
  priorityHigh: {
    backgroundColor: '#FEE2E2',
  },
  priorityTextHigh: {
    color: '#B91C1C',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
