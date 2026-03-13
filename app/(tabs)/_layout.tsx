import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '../../src/stores/locationStore';
import { Colors } from '../../src/theme/colors';

function DammWarningGate() {
  const { t } = useTranslation();
  const setIhramState = useLocationStore((s) => s.setIhramState);
  const setAlreadyCrossed = useLocationStore((s) => s.setAlreadyCrossed);

  const handleScholarConsulted = () => {
    setIhramState('crossed_without_ihram');
    setAlreadyCrossed(false); // clears gate, tabs re-enabled with banner
  };

  return (
    <View style={styles.gateContainer}>
      <Text style={styles.gateTitle}>{t('damm.title')}</Text>
      <Text style={styles.gateBody}>{t('damm.body')}</Text>
      <TouchableOpacity
        style={styles.gateButton}
        onPress={() => Linking.openURL('https://www.islamweb.net')}
      >
        <Text style={styles.gateButtonText}>{t('damm.islamweb')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.gateButton}
        onPress={() => Linking.openURL('tel:+966114083030')}
      >
        <Text style={styles.gateButtonText}>{t('damm.dar_alifta')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.gateButton, styles.gateButtonSecondary]}
        onPress={handleScholarConsulted}
      >
        <Text style={styles.gateButtonText}>{t('damm.consult_scholar')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const alreadyCrossed = useLocationStore((s) => s.alreadyCrossed);
  const ihramState = useLocationStore((s) => s.ihramState);

  // Block tabs — DammWarning gate
  if (alreadyCrossed && ihramState === 'not_worn') {
    return <DammWarningGate />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.goldAccent,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: Colors.parchmentBg,
          borderTopColor: Colors.brandGreen,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t('tabs.guide'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: t('tabs.tracker'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden from tab bar — accessible via More screen */}
      <Tabs.Screen name="ask" options={{ href: null }} />
      <Tabs.Screen name="azkar" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gateContainer: {
    flex: 1,
    backgroundColor: Colors.alertWarning,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  gateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  gateBody: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  gateButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  gateButtonSecondary: {
    backgroundColor: Colors.deepGreen,
    marginTop: 8,
  },
  gateButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
