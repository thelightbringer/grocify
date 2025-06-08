import { useColorScheme } from '@/hooks/useColorScheme';
import { createStyles } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (items: string[]) => void;
}

export function AddItemModal({ visible, onClose, onAdd }: AddItemModalProps) {
  const [itemsText, setItemsText] = useState('');
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleAdd = () => {
    const items = itemsText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    if (items.length > 0) {
      onAdd(items);
      setItemsText('');
      onClose();
    }
  };

  const handleCancel = () => {
    setItemsText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#23272e' : '#fff' }]}
          accessibilityViewIsModal
          accessibilityLabel="Add grocery items modal"
        >
          {/* Close Icon */}
          <Pressable
            onPress={handleCancel}
            style={local.closeIcon}
            accessibilityRole="button"
            accessibilityLabel="Close add items modal"
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color={isDark ? '#ECEDEE' : '#11181C'} />
          </Pressable>

          <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#11181C', marginTop: 8 }]}
            accessibilityRole="header"
          >
            Add Grocery Items
          </Text>
          <Text style={[styles.modalSubtitle, { color: isDark ? '#9BA1A6' : '#687076' }]}>
            Type items, one per line...
          </Text>
          <TextInput
            ref={inputRef}
            style={[
              styles.multilineInput,
              local.input,
              { color: isDark ? '#fff' : '#11181C', borderColor: isDark ? '#2A2A2A' : '#E5E5EA', minHeight: 120 },
            ]}
            placeholder="Type items, one per line..."
            placeholderTextColor={isDark ? '#9BA1A6' : '#687076'}
            value={itemsText}
            onChangeText={setItemsText}
            multiline
            textAlignVertical="top"
            autoFocus
            accessibilityLabel="Grocery items input"
            returnKeyType="done"
            blurOnSubmit
          />
          <Text style={local.helperText}>
            You can paste multiple items at once. One per line.
          </Text>
          <View style={local.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                local.button,
                pressed && local.buttonPressed,
              ]}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel adding items"
            >
              <Text style={[styles.buttonText, { color: isDark ? '#ECEDEE' : '#11181C' }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                local.button,
                !itemsText.trim() && styles.disabledButton,
                pressed && local.buttonPressed,
              ]}
              onPress={handleAdd}
              disabled={!itemsText.trim()}
              accessibilityRole="button"
              accessibilityLabel="Add items"
            >
              <Text style={styles.buttonText}>Add Items</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const local = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  input: {
    marginBottom: 10,
    marginTop: 4,
    fontSize: 17,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 120,
  },
  helperText: {
    fontSize: 13,
    color: '#687076',
    marginBottom: 8,
    marginTop: -8,
    textAlign: 'left',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  button: {
    minWidth: 100,
    minHeight: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
