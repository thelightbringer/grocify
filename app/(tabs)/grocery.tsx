import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddItemModal } from '../../components/AddItemModal';
import { colors, createStyles } from '../../styles/theme';
import { GroceryItem } from '../../types/grocery';

export default function GroceryScreen() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  const themeColors = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

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
          { bottom: insets.bottom + 40 }, // 🚀 dynamic and works across platforms
        ]}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
      <AddItemModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddItems}
      />
    </View>
    </SafeAreaView>
  );
} 