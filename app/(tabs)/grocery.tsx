import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert, Animated, FlatList, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AddItemModal } from '../../components/AddItemModal';
import {
    addItems,
    archivePurchasedItems,
    clearItems,
    removeItem,
    toggleItem,
} from '../../src/state/grocerySlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors, createStyles } from '../../styles/theme';
import { GroceryItem } from '../../types/grocery';

export default function GroceryScreen() {
  const items = useSelector((state: RootState) => state.grocery.items);
  const archived = useSelector((state: RootState) => state.grocery.archived);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  const themeColors = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [snackbar, setSnackbar] = useState<
    | { visible: boolean; type: 'archive'; count: number; archiveId: string; items: GroceryItem[] }
    | { visible: boolean; type: 'clear'; count: number; items: GroceryItem[] }
    | null
  >(null);
  const [snackbarAnim] = useState(new Animated.Value(0));
  const snackbarTimeout = useRef<NodeJS.Timeout | null>(null);

  // Set up header with trash and archive icons (native only)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {items.length > 0 && (
            <Pressable
              onPress={handleClearList}
              style={{ marginRight: 16 }}
              accessibilityLabel="Clear grocery list"
            >
              <Ionicons name="trash-outline" size={24} color={themeColors.text} />
            </Pressable>
          )}
          {items.some(item => item.isChecked) && (
            <Pressable
              onPress={handleArchiveChecked}
              style={{ marginRight: 4 }}
              accessibilityLabel="Archive checked items"
            >
              <Ionicons name="checkmark-done-outline" size={26} color={themeColors.success} />
            </Pressable>
          )}
        </View>
      ),
      headerTitle: 'Grocery List',
    });
  }, [navigation, items.length, items.some(item => item.isChecked), themeColors.text, themeColors.success]);

  function handleClearList() {
    if (items.length === 0) return;
    const clearedItems = [...items];
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to clear your grocery list? This cannot be undone.');
      if (confirmed) {
        dispatch(clearItems());
        showSnackbar({ type: 'clear', count: clearedItems.length, items: clearedItems });
      }
    } else {
      Alert.alert(
        'Clear Grocery List',
        'Are you sure you want to clear your grocery list? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              dispatch(clearItems());
              showSnackbar({ type: 'clear', count: clearedItems.length, items: clearedItems });
            },
          },
        ]
      );
    }
  }

  function handleArchiveChecked() {
    const checkedItems = items.filter(item => item.isChecked);
    const checkedCount = checkedItems.length;
    const message = checkedCount === 1
      ? 'Are you sure you want to archive the checked item?'
      : `Are you sure you want to archive ${checkedCount} checked items?`;
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(message);
      if (confirmed) {
        doArchiveChecked(checkedItems);
      }
    } else {
      Alert.alert(
        'Archive Checked Items',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Archive',
            style: 'destructive',
            onPress: () => doArchiveChecked(checkedItems),
          },
        ]
      );
    }
  }

  function showSnackbar(snackbarData: any) {
    setSnackbar({ visible: true, ...snackbarData });
    Animated.timing(snackbarAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    snackbarTimeout.current = setTimeout(() => {
      hideSnackbar();
    }, 5000);
    // Accessibility: announce
    if (Platform.OS !== 'web') {
      if (snackbarData.type === 'archive') {
        AccessibilityInfo.announceForAccessibility(`${snackbarData.count} item${snackbarData.count > 1 ? 's' : ''} archived. Undo.`);
      } else if (snackbarData.type === 'clear') {
        AccessibilityInfo.announceForAccessibility(`${snackbarData.count} item${snackbarData.count > 1 ? 's' : ''} cleared. Undo.`);
      }
    }
  }

  function hideSnackbar() {
    Animated.timing(snackbarAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSnackbar(null));
  }

  function doArchiveChecked(checkedItems: GroceryItem[]) {
    if (!checkedItems.length) return;
    dispatch(archivePurchasedItems());
    setTimeout(() => {
      const latestArchive = archived[0];
      if (latestArchive && latestArchive.items.length === checkedItems.length) {
        showSnackbar({
          type: 'archive',
          count: checkedItems.length,
          archiveId: latestArchive.id,
          items: checkedItems,
        });
      }
    }, 50);
  }

  function handleUndoSnackbar() {
    if (!snackbar) return;
    if (snackbar.type === 'archive' && snackbar.archiveId && snackbar.items.length) {
      dispatch({ type: 'grocery/removeArchive', payload: snackbar.archiveId });
      dispatch(addItems(snackbar.items.map(i => i.name)));
      hideSnackbar();
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    } else if (snackbar.type === 'clear' && snackbar.items.length) {
      dispatch(addItems(snackbar.items.map(i => i.name)));
      hideSnackbar();
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    }
  }

  const handleAddItems = (newItems: string[]) => {
    dispatch(addItems(newItems));
    setIsModalVisible(false);
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleToggleChecked = (id: string) => {
    dispatch(toggleItem(id));
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable
          onPress={() => handleToggleChecked(item.id)}
          style={{ marginRight: 12 }}
          accessibilityLabel={item.isChecked ? 'Uncheck item' : 'Check item'}
        >
          <Ionicons
            name={item.isChecked ? 'checkbox' : 'square-outline'}
            size={24}
            color={item.isChecked ? themeColors.success : themeColors.text}
          />
        </Pressable>
        <Text
          style={[
            { flex: 1, color: themeColors.text, fontSize: 16 },
            item.isChecked && localStyles.strikeThrough,
          ]}
        >
          {item.name}
        </Text>
        <Pressable
          onPress={() => handleRemoveItem(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={24} color={themeColors.text} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={styles.container}>
        {/* Custom Header Row for web only */}
        {Platform.OS === 'web' && items.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
            <>
              <Pressable
                onPress={handleArchiveChecked}
                accessibilityLabel="Archive checked items"
                style={({ pressed }) => [{ marginRight: 8, padding: 8, borderRadius: 20, backgroundColor: pressed ? themeColors.border : 'transparent' }]}
                disabled={!items.some(item => item.isChecked)}
              >
                <Ionicons name="checkmark-done-outline" size={26} color={themeColors.success} />
              </Pressable>
              <Pressable
                onPress={handleClearList}
                accessibilityLabel="Clear grocery list"
                style={({ pressed }) => [{ padding: 8, borderRadius: 20, backgroundColor: pressed ? themeColors.border : 'transparent' }]}
              >
                <Ionicons name="trash-outline" size={24} color={themeColors.text} />
              </Pressable>
            </>
          </View>
        )}
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No items yet. Add some!</Text>
          }
        />
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={[
            styles.fab,
            { bottom: insets.bottom + 40 },
          ]}
        >
          <Ionicons name="add" size={32} color="white" />
        </Pressable>
        <AddItemModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddItems}
        />
        {/* iOS/Web Toast/Snackbar */}
        {showToast && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: insets.bottom + 80,
              alignItems: 'center',
              opacity: toastOpacity,
              zIndex: 9999,
            }}
            pointerEvents="none"
          >
            <View style={{
              backgroundColor: isDark ? '#23272e' : '#fff',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Text style={{ color: themeColors.success, fontWeight: 'bold', fontSize: 16 }}>✔️ Grocery list cleared</Text>
            </View>
          </Animated.View>
        )}
        {/* Snackbar for archive undo */}
        {snackbar && snackbar.visible && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: insets.bottom + 80,
              alignItems: 'center',
              opacity: snackbarAnim,
              transform: [{ translateY: snackbarAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
              zIndex: 9999,
              pointerEvents: 'box-none',
            }}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#fff',
              borderRadius: 24,
              paddingHorizontal: 20,
              paddingVertical: 14,
              maxWidth: 420,
              minWidth: 220,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Ionicons name={snackbar.type === 'archive' ? 'checkmark-circle' : 'trash'} size={24} color={snackbar.type === 'archive' ? themeColors.success : themeColors.error} style={{ marginRight: 12 }} />
              <Text style={{ color: themeColors.text, fontSize: 16, flexShrink: 1 }}>
                {snackbar.count} item{snackbar.count > 1 ? 's' : ''} {snackbar.type === 'archive' ? 'archived' : 'cleared'}
              </Text>
              <View style={{ width: 1, height: 24, backgroundColor: themeColors.border, marginHorizontal: 12, opacity: 0.5 }} />
              <Pressable
                onPress={handleUndoSnackbar}
                style={({ pressed }) => [{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: pressed ? (isDark ? '#2A2A2A' : '#E5E5EA') : 'transparent',
                }]}
                accessibilityRole="button"
                accessibilityLabel="Undo"
              >
                <Text style={{ color: themeColors.primary, fontWeight: 'bold', fontSize: 16 }}>Undo</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Add strike-through style
const localStyles = StyleSheet.create({
  strikeThrough: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
}); 