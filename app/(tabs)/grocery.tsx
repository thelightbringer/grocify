import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Platform, Pressable, Text, ToastAndroid, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddItemModal } from '../../components/AddItemModal';
import { colors, createStyles } from '../../styles/theme';
import { GroceryItem } from '../../types/grocery';

export default function GroceryScreen() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  const themeColors = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Set up header with trash icon (native only)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        items.length > 0 ? (
          <Pressable
            onPress={handleClearList}
            style={{ marginRight: 16 }}
            accessibilityLabel="Clear grocery list"
          >
            <Ionicons name="trash-outline" size={24} color={themeColors.text} />
          </Pressable>
        ) : null
      ),
      headerTitle: 'Grocery List',
    });
  }, [navigation, items.length, themeColors.text]);

  function handleClearList() {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to clear your grocery list? This cannot be undone.');
      if (confirmed) {
        setItems([]);
        setShowToast(true);
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(toastOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => setShowToast(false));
          }, 1200);
        });
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
              setItems([]);
              if (Platform.OS === 'android') {
                ToastAndroid.show('✔️ Grocery list cleared', ToastAndroid.SHORT);
              } else {
                setShowToast(true);
                Animated.timing(toastOpacity, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => {
                  setTimeout(() => {
                    Animated.timing(toastOpacity, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }).start(() => setShowToast(false));
                  }, 1200);
                });
              }
            },
          },
        ]
      );
    }
  }

  const handleAddItems = (newItems: string[]) => {
    const itemsToAdd: GroceryItem[] = newItems.map(name => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      quantity: 1,
      unit: 'piece',
      category: 'uncategorized',
      price: 0,
      isChecked: false,
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    setItems(prev => [...prev, ...itemsToAdd]);
    setIsModalVisible(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={{ flex: 1, color: themeColors.text }}>{item.name}</Text>
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
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No grocery items yet. Add some!</Text>
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
      </View>
    </SafeAreaView>
  );
} 