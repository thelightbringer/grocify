import { useColorScheme } from '@/hooks/useColorScheme';
import { createStyles } from '@/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const STORE_OPTIONS = ['Tesco', 'Lidl', 'Aldi', 'None'] as const;
type StoreOption = typeof STORE_OPTIONS[number];
const STORAGE_KEY = 'storePreference';

export default function SettingsScreen() {
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);
  const [selected, setSelected] = useState<StoreOption>('None');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val && STORE_OPTIONS.includes(val as StoreOption)) {
        setSelected(val as StoreOption);
      }
      setLoading(false);
    });
  }, []);

  const handleSelect = async (option: StoreOption) => {
    setSelected(option);
    await AsyncStorage.setItem(STORAGE_KEY, option);
  };

  return (
    <View style={[styles.container, { padding: 24, justifyContent: 'flex-start', alignItems: 'center' }]}> 
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Settings</Text>
      <Text style={{ fontSize: 16, marginBottom: 24 }}>
        <Text style={{ fontWeight: '600' }}>Store Preference:</Text>{' '}
        {loading ? 'Loading...' : selected}
      </Text>
      <View style={{ width: '100%', maxWidth: 340, backgroundColor: isDark ? '#23272e' : '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Choose your preferred store:</Text>
        {STORE_OPTIONS.map(option => (
          <Pressable
            key={option}
            onPress={() => handleSelect(option)}
            style={({ pressed }) => [{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: pressed ? (isDark ? '#2A2A2A' : '#E5E5EA') : 'transparent',
              marginBottom: 2,
            }]}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === option }}
            accessibilityLabel={option}
          >
            <View style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: selected === option ? '#007AFF' : '#AAA',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              backgroundColor: isDark ? '#151718' : '#fff',
            }}>
              {selected === option && (
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#007AFF' }} />
              )}
            </View>
            <Text style={{ fontSize: 16, color: isDark ? '#ECEDEE' : '#11181C' }}>{option}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
} 