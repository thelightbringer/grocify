import { useColorScheme } from '@/hooks/useColorScheme';
import { createStyles } from '@/styles/theme';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 20 }}>Settings Screen</Text>
    </View>
  );
} 