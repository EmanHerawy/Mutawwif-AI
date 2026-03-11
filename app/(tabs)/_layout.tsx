import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
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
        tabBarInactiveTintColor: Colors.textPrimary,
        tabBarStyle: {
          backgroundColor: Colors.parchmentBg,
          borderTopColor: Colors.brandGreen,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.dashboard') }} />
      <Tabs.Screen name="guide" options={{ title: t('tabs.guide') }} />
      <Tabs.Screen name="tracker" options={{ title: t('tabs.tracker') }} />
      <Tabs.Screen name="ask" options={{ title: t('tabs.ask') }} />
      <Tabs.Screen name="azkar" options={{ title: t('tabs.azkar') }} />
      <Tabs.Screen name="wallet" options={{ title: t('tabs.wallet') }} />
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
