import { useColorScheme } from '@/hooks/useColorScheme';
import { createStyles } from '@/styles/theme';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Add Grocery Items
          </Text>
          <Text style={[styles.modalSubtitle, { color: isDark ? '#9BA1A6' : '#687076' }]}>
            Enter each item on a new line
          </Text>
          <TextInput
            style={[styles.multilineInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
            placeholder="Enter items (one per line)"
            placeholderTextColor={isDark ? '#9BA1A6' : '#687076'}
            value={itemsText}
            onChangeText={setItemsText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, !itemsText.trim() && styles.disabledButton]}
              onPress={handleAdd}
              disabled={!itemsText.trim()}>
              <Text style={styles.buttonText}>Add Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
