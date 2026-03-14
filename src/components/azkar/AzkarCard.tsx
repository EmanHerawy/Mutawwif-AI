import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, TouchTarget } from '../../theme/spacing';
import type { AzkarItem } from '../../types/azkar.types';

interface Props {
  azkar: AzkarItem;
  isHighVisibility?: boolean;
}

export function AzkarCard({ azkar, isHighVisibility = false }: Props) {
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);

  return (
    <View style={[styles.card, isHighVisibility && styles.cardHV]}>
      {azkar.occasionAr ? (
        <View style={[styles.occasionBadge, isHighVisibility && styles.occasionBadgeHV]}>
          <Text style={[styles.occasionText, isHighVisibility && styles.occasionTextHV]}>
            🕐 {azkar.occasionAr}
          </Text>
        </View>
      ) : null}

      <Text style={[styles.arabic, isHighVisibility && styles.arabicHV]}>
        {azkar.arabicText}
      </Text>

      {showTransliteration && (
        <Text style={[styles.transliteration, isHighVisibility && styles.transliterationHV]}>
          {azkar.transliteration}
        </Text>
      )}

      <Text style={[styles.translation, isHighVisibility && styles.translationHV]}>
        {azkar.translationEn}
      </Text>

      {azkar.source && (
        <Text style={[styles.source, isHighVisibility && styles.sourceHV]}>
          {azkar.source}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowTransliteration((s) => !s)}
          accessibilityRole="button"
        >
          <Text style={[styles.toggleText, isHighVisibility && styles.toggleTextHV]}>
            {showTransliteration ? 'Hide' : 'Transliteration'}
          </Text>
        </TouchableOpacity>

        <View style={styles.repeatContainer}>
          <TouchableOpacity
            style={[styles.repeatButton, isHighVisibility && styles.repeatButtonHV]}
            onPress={() => setRepeatCount((c) => c + 1)}
            accessibilityRole="button"
            accessibilityLabel={`Count repeat: ${repeatCount}`}
          >
            <Text style={[styles.repeatCount, isHighVisibility && styles.repeatCountHV]}>
              {repeatCount}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.repeatOf, isHighVisibility && styles.repeatOfHV]}>
            /{azkar.repeatCount}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E8E0D0',
  },
  cardHV: { backgroundColor: Colors.hvBackground, borderColor: Colors.hvLapNumber },
  arabic: {
    fontSize: 22,
    lineHeight: 38,
    color: Colors.textPrimary,
    textAlign: 'right',
    fontFamily: 'Amiri',
    marginBottom: Spacing.sm,
  },
  arabicHV: { color: Colors.hvTextPrimary, fontSize: 24 },
  transliteration: {
    fontSize: 14,
    color: Colors.brandGreen,
    marginBottom: Spacing.xs,
    fontStyle: 'italic',
  },
  transliterationHV: { color: Colors.hvLapNumber },
  translation: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: Spacing.sm },
  translationHV: { color: '#CCC' },
  occasionBadge: {
    backgroundColor: Colors.brandGreen + '12',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  occasionBadgeHV: { backgroundColor: Colors.goldAccent + '22' },
  occasionText: {
    fontSize: 12,
    color: Colors.brandGreen,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'right',
  },
  occasionTextHV: { color: Colors.goldAccent },
  source: { fontSize: 12, color: '#888', marginBottom: Spacing.sm },
  sourceHV: { color: '#666' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleButton: { padding: Spacing.xs },
  toggleText: { color: Colors.brandGreen, fontSize: 13, fontWeight: '600' },
  toggleTextHV: { color: Colors.hvLapNumber },
  repeatContainer: { flexDirection: 'row', alignItems: 'center' },
  repeatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatButtonHV: { backgroundColor: Colors.hvCounterButton },
  repeatCount: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  repeatCountHV: { color: Colors.hvCounterButtonText },
  repeatOf: { color: Colors.textPrimary, fontSize: 14, marginLeft: 4 },
  repeatOfHV: { color: Colors.hvTextPrimary },
});
