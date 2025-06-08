import { useColorScheme } from '@/hooks/useColorScheme';
import { createStyles } from '@/styles/theme';
import { Text, View } from 'react-native';

export default function ReceiptsScreen() {
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 20 }}>Receipts Screen</Text>
    </View>
  );
} 