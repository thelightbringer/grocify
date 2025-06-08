import { colors, createStyles } from '@/styles/theme';
import { Text, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const styles = createStyles(isDark);

  return (
    <View style={[styles.container, { padding: 20 }]}>
      <Text 
        style={{ 
          color: colors[isDark ? 'dark' : 'light'].text,
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 20
        }}
      >
        Hello, Grocify!
      </Text>
    </View>
  );
}
