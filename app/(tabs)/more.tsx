import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';

type MenuItem = {
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  { labelKey: 'tabs.ask',      icon: 'chatbubble-ellipses-outline', route: '/(tabs)/ask' },
  { labelKey: 'tabs.azkar',   icon: 'moon-outline',                route: '/(tabs)/azkar' },
  { labelKey: 'tabs.wallet',  icon: 'wallet-outline',              route: '/(tabs)/wallet' },
  { labelKey: 'tabs.profile', icon: 'person-circle-outline',       route: '/(tabs)/profile' },
  { labelKey: 'tabs.settings', icon: 'settings-outline',           route: '/(tabs)/settings' },
];

export default function MoreScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{t('tabs.more')}</Text>
      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.row}
          onPress={() => router.push(item.route as never)}
        >
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon} size={24} color={Colors.brandGreen} />
          </View>
          <Text style={styles.label}>{t(item.labelKey)}</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
  },
  content: {
    padding: 24,
    paddingTop: 64,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.brandGreen,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  iconWrap: {
    width: 36,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
