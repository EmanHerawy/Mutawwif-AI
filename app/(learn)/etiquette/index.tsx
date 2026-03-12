import { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { ETIQUETTE_DATA } from '../../../src/data/etiquette';
import { EtiquetteCard } from '../../../src/components/etiquette/EtiquetteCard';
import { EtiquetteFilterBar } from '../../../src/components/etiquette/EtiquetteFilterBar';
import { NoDaararBanner } from '../../../src/components/etiquette/NoDaararBanner';
import type { EtiquetteCategory } from '../../../src/types/etiquette.types';
import { Colors } from '../../../src/theme/colors';

export default function EtiquetteIndexScreen() {
  const { i18n } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const [selectedCat, setSelectedCat] = useState<EtiquetteCategory | 'all'>('all');

  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  const filtered = useMemo(() => {
    return ETIQUETTE_DATA.filter((item) => {
      const genderMatch =
        item.applicableTo === 'all' || item.applicableTo === gender;
      const catMatch = selectedCat === 'all' || item.category === selectedCat;
      return genderMatch && catMatch;
    });
  }, [selectedCat, gender]);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{ title: isAr ? 'آداب الحرمين' : 'Etiquette Guide' }}
      />
      <EtiquetteFilterBar
        selected={selectedCat}
        onSelect={setSelectedCat}
        gender={gender}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EtiquetteCard item={item} />}
        ListHeaderComponent={
          <View style={styles.bannerWrapper}>
            <NoDaararBanner />
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  bannerWrapper: { paddingHorizontal: 16, paddingTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
});
