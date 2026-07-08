import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { TodoItem } from '../../components/TodoItem';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority?: 'Low' | 'Medium' | 'High';
}

export default function TodoDashboard() {
  const { user, logout } = useAuth();
  
  // State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Form input states
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [todoDescription, setTodoDescription] = useState<string>('');
  const [todoDueDate, setTodoDueDate] = useState<string>('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState<boolean>(false);
  // Delete confirmation state
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>('');
  const [confirmCompleteVisible, setConfirmCompleteVisible] = useState<boolean>(false);
  const [confirmCompleteId, setConfirmCompleteId] = useState<string | null>(null);
  const [confirmCompleteTitle, setConfirmCompleteTitle] = useState<string>('');
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  // Logout confirmation state
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState<boolean>(false);

  const totalTasks = todos.length;
  const activeTasks = todos.filter((task) => !task.completed).length;
  const completedTasks = todos.filter((task) => task.completed).length;
  const greetingName = user?.email?.split('@')[0] || 'there';

  // Fetch todos from API
  const fetchTodos = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setToastType('error');
      setToastMessage('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos(true);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTodos(false);
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (completed) {
      const todo = todos.find((task) => task._id === id);
      if (todo) {
        setConfirmCompleteId(id);
        setConfirmCompleteTitle(todo.title);
        setConfirmCompleteVisible(true);
      }
      return;
    }

    try {
      await api.put(`/todos/${id}`, { completed });
      fetchTodos(false);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleCompleteTodo = async () => {
    if (!confirmCompleteId) return;

    setCompleteLoading(true);
    try {
      await api.put(`/todos/${confirmCompleteId}`, { completed: true });
      setToastType('success');
      setToastMessage('Task completed Successfully');
      fetchTodos(false);
    } catch (error) {
      console.error('Error completing todo:', error);
      setToastType('error');
      setToastMessage('Unable to complete task. Please try again.');
    } finally {
      setCompleteLoading(false);
      setConfirmCompleteVisible(false);
      setConfirmCompleteId(null);
      setConfirmCompleteTitle('');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      // Refetch latest tasks after state mutation
      fetchTodos(false);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDeleteRequest = (id: string, title?: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteTitle(title || 'this task');
    setConfirmDeleteVisible(true);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingTodo(null);
    setTodoTitle('');
    setTodoDescription(' add details about this task ');
    setPriority('Medium');
    setFormError(null);
    setModalVisible(true);
  };

  const openEditModal = (todo: Todo) => {
    setModalMode('edit');
    setEditingTodo(todo);
    setTodoTitle(todo.title);
    setTodoDescription(todo.description || '');
    setPriority((todo as any).priority || 'Medium');
    setFormError(null);
    setModalVisible(true);
  };

  const handleSaveTodo = async () => {
    if (!todoTitle.trim()) {
      setFormError('Task title is required');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (modalMode === 'create') {
        const descriptionToSend = todoDescription.trim() === 'add details about this task' || todoDescription.trim() === '' ? '' : todoDescription.trim();
        await api.post('/todos', {
          title: todoTitle.trim(),
            description: descriptionToSend,
            priority,
        });
        setToastType('success');
        setToastMessage('Task created successfully');
      } else if (modalMode === 'edit' && editingTodo) {
        const descriptionToSend = todoDescription.trim() === 'add details about this task' || todoDescription.trim() === '' ? '' : todoDescription.trim();
        await api.put(`/todos/${editingTodo._id}`, {
          title: todoTitle.trim(),
            description: descriptionToSend,
            priority,
        });
        setToastType('success');
        setToastMessage('Task updated successfully');
      }
      setModalVisible(false);
      fetchTodos(false);
    } catch (error) {
      console.error('Error saving todo:', error);
      setFormError('Failed to save task. Please try again.');
      setToastType('error');
      setToastMessage('Unable to save task.');
    } finally {
      setSaving(false);
    }
  };

  // Filter logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const renderHeader = () => (
    <>
      <View style={styles.headerBar}>
        <View style={styles.brandBlock}>
          <View style={styles.logoBadge}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#6366f1" />
          </View>
          <View>
            <Text style={styles.brandTitle}>TodoFlow</Text>
            <Text style={styles.brandSubtitle}>Your productivity command center</Text>
          </View>
        </View>

        <View style={styles.userBlock}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() || 'T'}</Text>
            </View>
            <View style={styles.userDetails}>
              <View style={styles.userGreetingRow}>
                <Text style={styles.userName}>Good Morning</Text>
                <Ionicons name="sunny" size={16} color="#F59E0B" style={{ marginLeft: 8 }} />
              </View>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={() => setLogoutConfirmVisible(true)} style={styles.logoutButton} activeOpacity={0.78}>
              <Ionicons name="log-out-outline" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity activeOpacity={0.95} style={styles.statCard}>
          <Text style={styles.statLabel}>Total Tasks</Text>
          <Text style={styles.statValue}>{totalTasks}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.95} style={styles.statCard}>
          <Text style={styles.statLabel}>Active Tasks</Text>
          <Text style={styles.statValue}>{activeTasks}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.95} style={styles.statCard}>
          <Text style={styles.statLabel}>Completed Tasks</Text>
          <Text style={styles.statValue}>{completedTasks}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Track your tasks with ease</Text>
        <Text style={styles.welcomeSubtitle}>Stay focused and ship faster with a clean, distraction-free workflow.</Text>
      </View>

      {toastMessage ? (
        <View style={[styles.toastContainer, toastType === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Ionicons name={toastType === 'success' ? 'checkmark-circle' : 'alert-circle'} size={18} color="#ffffff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <View style={styles.filterBar}>
        {[
          { key: 'all', label: `All (${totalTasks})` },
          { key: 'active', label: `Active (${activeTasks})` },
          { key: 'completed', label: `Completed (${completedTasks})` },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setFilter(tab.key as 'all' | 'active' | 'completed')}
            style={[styles.filterTab, filter === tab.key ? styles.filterTabActive : null]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, filter === tab.key ? styles.filterTabTextActive : null]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerPage}>
        <View style={styles.contentWrapper}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          <FlatList
            style={styles.taskList}
            data={filteredTodos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={handleToggleTodo}
                onEdit={openEditModal}
                onDelete={handleDeleteRequest}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="clipboard-outline" size={68} color="#6B7280" />
                <Text style={styles.emptyText}>Nothing here yet</Text>
                <Text style={styles.emptySubText}>Create tasks, assign priorities, and stay on top of your day.</Text>
                <View style={{ marginTop: 12 }}>
                  <AppButton compact title="Create your first task" onPress={openCreateModal} />
                </View>
              </View>
            }
          />
        )}

        {/* Create / Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalOverlay}
            >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modalMode === 'create' ? 'Create Task' : 'Edit Task'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} accessibilityLabel="Close modal">
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {formError && <Text style={styles.modalError}>{formError}</Text>}

              <View style={styles.formInner}>
                <AppInput
                  label="Title"
                  placeholder="What needs to be done?"
                  value={todoTitle}
                  onChangeText={(text) => {
                    setTodoTitle(text);
                    setFormError(null);
                  }}
                  autoFocus
                />

                <AppInput
                  label="Description (Optional)"
                  placeholder="Add details about this task"
                  value={todoDescription}
                  onChangeText={setTodoDescription}
                  multiline
                  numberOfLines={4}
                  onFocus={() => {
                    if (todoDescription === ' add details about this task ') {
                      setTodoDescription('');
                    }
                  }}
                  inputStyle={[
                    todoDescription === ' add details about this task '
                      ? { textAlignVertical: 'center', paddingTop: 0, color: '#6B7280' }
                      : { textAlignVertical: 'top', paddingTop: 6 },
                    { minHeight: 90 },
                  ]}
                />

                {/* Due Date removed per UI update - not required */}

                <View style={styles.priorityRow}>
                  {['Low', 'Medium', 'High'].map((option) => {
                    const selected = priority === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setPriority(option as 'Low' | 'Medium' | 'High')}
                        style={[
                          styles.priorityChip,
                          selected ? styles.priorityChipActive : null,
                          option === 'High' ? styles.priorityHigh : null,
                        ]}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.priorityText, selected ? styles.priorityTextActive : null]}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.modalActionsRow}>
                  <AppButton
                    compact
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                    variant="secondary"
                    style={[styles.modalActionButton, styles.cancelButton]}
                  />
                  <AppButton
                    compact
                    title={modalMode === 'create' ? 'Create Task' : 'Save Changes'}
                    onPress={handleSaveTodo}
                    loading={saving}
                    style={[styles.modalActionButton, styles.saveButton]}
                  />
                </View>
              </View>
            </View>
            
          </KeyboardAvoidingView>
        </Modal>
        {/* Delete Confirmation Modal (separate from Create/Edit Modal) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={confirmDeleteVisible}
          onRequestClose={() => setConfirmDeleteVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.confirmOverlay}
          >
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Delete task?</Text>
              <Text style={styles.confirmBody}>Are you sure you want to delete "{confirmDeleteTitle}"? This action cannot be undone.</Text>
              <View style={styles.confirmActions}>
                <AppButton compact title="Cancel" variant="secondary" onPress={() => setConfirmDeleteVisible(false)} style={styles.confirmCancel} />
                <AppButton compact title="Delete" onPress={async () => {
                  if (confirmDeleteId) {
                    await handleDeleteTodo(confirmDeleteId);
                  }
                  setConfirmDeleteVisible(false);
                }} style={styles.confirmDelete} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={confirmCompleteVisible}
          onRequestClose={() => setConfirmCompleteVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.confirmOverlay}
          >
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Complete task?</Text>
              <Text style={styles.confirmBody}>Mark "{confirmCompleteTitle}" as completed?</Text>
              <View style={styles.confirmActions}>
                <AppButton compact title="Cancel" variant="secondary" onPress={() => setConfirmCompleteVisible(false)} style={styles.confirmCancel} />
                <AppButton compact title="Complete" loading={completeLoading} onPress={handleCompleteTodo} style={styles.confirmComplete} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {/* Logout Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutConfirmVisible}
          onRequestClose={() => setLogoutConfirmVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.confirmOverlay}
          >
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Sign out?</Text>
              <Text style={styles.confirmBody}>Are you sure you want to sign out?</Text>
              <View style={styles.confirmActions}>
                <AppButton compact title="Cancel" variant="secondary" onPress={() => setLogoutConfirmVisible(false)} style={styles.confirmCancel} />
                <AppButton compact title="Sign Out" onPress={() => { setLogoutConfirmVisible(false); logout(); }} style={styles.confirmDelete} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        </View>
        <TouchableOpacity
          onPress={openCreateModal}
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1280,
    paddingHorizontal: 20,
    paddingTop: 16,
    alignSelf: 'center',
  },
  centerPage: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.18)',
  },
  brandTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#6366F1',
    fontSize: 18,
    fontWeight: '800',
  },
  userDetails: {
    maxWidth: 180,
  },
  userGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  userEmail: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    cursor: 'pointer',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
  },
  welcomeSection: {
    marginBottom: 12,
  },
  welcomeTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 520,
  },
  filterBar: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: '#6366F1',
  },
  filterTabText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  listContent: {
    paddingBottom: 120,
  },
  taskList: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      },
    }),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  fab: {
    ...Platform.select({
      web: {
        position: 'fixed',
        right: 32,
        bottom: 32,
        zIndex: 9999,
      },
      default: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        elevation: 8,
      },
    }),
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    borderWidth: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    maxWidth: 550,
    alignSelf: 'center',
    // subtle card shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  modalError: {
    color: '#b91c1c',
    backgroundColor: '#fff1f2',
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '600',
  },
  modalInput: {
    marginTop: 4,
  },
  formInner: {
    paddingTop: 6,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  priorityChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  priorityText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  priorityTextActive: {
    color: '#ffffff',
  },
  priorityMedium: {
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  priorityHigh: {
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    paddingHorizontal: 20,
  },
  confirmBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  confirmBody: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 16,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  confirmCancel: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmDelete: {
    backgroundColor: '#ef4444',
    borderColor: 'rgba(239,68,68,0.12)',
  },
  confirmComplete: {
    backgroundColor: '#22c55e',
    borderColor: 'rgba(34,197,94,0.12)',
  },
  cancelButton: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  saveButton: {
    height: 44,
    borderRadius: 10,
    marginTop: 0,
    paddingHorizontal: 18,
  },
  modalActionButton: {
    width: undefined,
    minWidth: 110,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  toastSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.16)',
    borderWidth: 1,
  },
  toastError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.16)',
    borderWidth: 1,
  },
  toastText: {
    color: '#111827',
    fontSize: 14,
    flex: 1,
  },
});
