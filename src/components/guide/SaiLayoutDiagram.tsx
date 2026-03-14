/**
 * SaiLayoutDiagram
 *
 * Schematic cross-section of the Masa'a (Sa'i corridor) showing:
 * - 4 floors (ground + 3 upper floors, now enclosed as part of the mosque)
 * - Safa end (south) and Marwa end (north)
 * - Direction: Safa → Marwa (lap 1), Marwa → Safa (lap 2), etc.
 * - The green marker zone (jogging zone — men only, laps 1–3)
 * - Wheelchair/accessible level (ground floor)
 */
import Svg, {
  Rect,
  Line,
  Text as SvgText,
  Path,
  Circle,
} from 'react-native-svg';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';

const FLOORS = 4; // ground + 3 upper
const FLOOR_LABELS_AR = ['الطابق الثالث', 'الطابق الثاني', 'الطابق الأول', 'الدور الأرضي'];
const FLOOR_LABELS_EN = ['3rd Floor', '2nd Floor', '1st Floor', 'Ground Floor'];

export function SaiLayoutDiagram() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const { width } = useWindowDimensions();

  const W = Math.min(width - 32, 380);
  const sideLabel = 50; // left side labels
  const corridorW = W - sideLabel - 12;
  const corridorX = sideLabel;
  const floorH = 48;
  const H = FLOORS * floorH + 60; // 60 for header + footer labels

  const headerH = 30;

  // Green jogging zone (middle portion of ground floor, approximately 80m of the 394m corridor)
  const jogStart = corridorX + corridorW * 0.35;
  const jogEnd = corridorX + corridorW * 0.65;

  const safaLabel = isAr ? 'الصفا' : 'Safa';
  const marwaLabel = isAr ? 'المروة' : 'Marwa';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isAr ? 'مخطط المسعى (الصفا–المروة)' : "Masa'a Diagram (Safa–Marwa)"}
      </Text>
      <Text style={styles.subtitle}>
        {isAr
          ? 'المسعى مُتعدد الأدوار — إجمالي 7 أشواط تنتهي عند المروة'
          : "Multi-floor corridor — 7 trips ending at Marwa"}
      </Text>

      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* Safa and Marwa labels at top */}
        <SvgText
          x={corridorX + 10}
          y={20}
          fontSize={11}
          fontWeight="700"
          fill={Colors.brandGreen}
          textAnchor="start"
        >
          {isAr ? safaLabel + ' ▶' : '◀ ' + safaLabel}
        </SvgText>
        <SvgText
          x={W - 10}
          y={20}
          fontSize={11}
          fontWeight="700"
          fill={Colors.brandGreen}
          textAnchor="end"
        >
          {isAr ? '◀ ' + marwaLabel : marwaLabel + ' ▶'}
        </SvgText>

        {/* Floors */}
        {[0, 1, 2, 3].map((floorIdx) => {
          const y = headerH + floorIdx * floorH;
          const isGround = floorIdx === FLOORS - 1;
          const fillColor = isGround
            ? Colors.brandGreen + '10'
            : Colors.brandGreen + '06';

          return (
            <React.Fragment key={floorIdx}>
              {/* Floor background */}
              <Rect
                x={corridorX}
                y={y}
                width={corridorW}
                height={floorH - 1}
                fill={fillColor}
                rx={2}
              />

              {/* Floor border */}
              <Rect
                x={corridorX}
                y={y}
                width={corridorW}
                height={floorH - 1}
                fill="none"
                stroke={Colors.brandGreen + '30'}
                strokeWidth={1}
                rx={2}
              />

              {/* Floor label */}
              <SvgText
                x={corridorX - 6}
                y={y + floorH / 2 + 4}
                fontSize={8.5}
                fill={Colors.textPrimary}
                opacity={0.55}
                textAnchor="end"
              >
                {isAr ? FLOOR_LABELS_AR[floorIdx] : FLOOR_LABELS_EN[floorIdx]}
              </SvgText>

              {/* Accessibility icon on ground floor */}
              {isGround && (
                <SvgText
                  x={corridorX + 8}
                  y={y + floorH / 2 + 4}
                  fontSize={12}
                  textAnchor="start"
                >
                  ♿
                </SvgText>
              )}

              {/* Green jogging zone on ground floor */}
              {isGround && (
                <>
                  <Rect
                    x={jogStart}
                    y={y + 4}
                    width={jogEnd - jogStart}
                    height={floorH - 10}
                    fill="#22C55E22"
                    rx={3}
                  />
                  <SvgText
                    x={(jogStart + jogEnd) / 2}
                    y={y + floorH / 2 + 4}
                    fontSize={8}
                    fill="#22C55E"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {isAr ? 'منطقة الهرولة (رجال)' : 'Jogging zone (men)'}
                  </SvgText>
                </>
              )}

              {/* Direction arrows inside corridor */}
              {!isGround && (
                <SvgText
                  x={corridorX + corridorW / 2}
                  y={y + floorH / 2 + 4}
                  fontSize={9}
                  fill={Colors.brandGreen}
                  textAnchor="middle"
                  opacity={0.45}
                >
                  {isAr ? '← ذهاباً وإياباً →' : '← Back and forth →'}
                </SvgText>
              )}

              {/* Safa platform (left) */}
              <Rect
                x={corridorX}
                y={y + 2}
                width={8}
                height={floorH - 5}
                fill={Colors.brandGreen}
                opacity={0.25}
                rx={2}
              />

              {/* Marwa platform (right) */}
              <Rect
                x={corridorX + corridorW - 8}
                y={y + 2}
                width={8}
                height={floorH - 5}
                fill={Colors.brandGreen}
                opacity={0.25}
                rx={2}
              />

              {/* Staircase/escalator indicators between floors */}
              {floorIdx < FLOORS - 1 && (
                <>
                  <Line
                    x1={corridorX + corridorW - 18}
                    y1={y + floorH - 1}
                    x2={corridorX + corridorW - 18}
                    y2={y + floorH + 1}
                    stroke={Colors.goldAccent}
                    strokeWidth={4}
                  />
                  <Line
                    x1={corridorX + 18}
                    y1={y + floorH - 1}
                    x2={corridorX + 18}
                    y2={y + floorH + 1}
                    stroke={Colors.goldAccent}
                    strokeWidth={4}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* Bottom labels */}
        <SvgText
          x={corridorX}
          y={H - 6}
          fontSize={8.5}
          fill={Colors.textPrimary}
          opacity={0.4}
          textAnchor="start"
        >
          {isAr ? 'طول المسار: ~394م' : 'Corridor length: ~394m'}
        </SvgText>
        <SvgText
          x={W - 12}
          y={H - 6}
          fontSize={8.5}
          fill={Colors.goldAccent}
          opacity={0.7}
          textAnchor="end"
        >
          {isAr ? '■ سلالم/مصاعد' : '■ Stairs/Escalators'}
        </SvgText>

      </Svg>

      {/* Notes */}
      <View style={styles.notesBox}>
        <Text style={styles.noteItem}>
          {isAr
            ? '• الأشواط: صفا → مروة = ١، مروة → صفا = ٢... (٧ أشواط تنتهي عند المروة)'
            : '• Laps: Safa→Marwa=1, Marwa→Safa=2... (7 laps ending at Marwa)'}
        </Text>
        <Text style={styles.noteItem}>
          {isAr
            ? '• الهرولة بين العلمين الأخضرين للرجال فقط — المرأة تمشي الكامل'
            : '• Jogging between green markers: men only (laps 1–3). Women walk the full distance.'}
        </Text>
        <Text style={styles.noteItem}>
          {isAr
            ? '• الطابق الأرضي مُخصص لذوي الاحتياجات — كراسي كهربائية متاحة'
            : '• Ground floor has wheelchair lanes — electric wheelchairs available from services desk'}
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        {isAr
          ? '⚠️ مخطط توضيحي — للاتجاهات العامة فقط'
          : '⚠️ Schematic diagram — for general orientation only'}
      </Text>
    </View>
  );
}

// React import needed for React.Fragment
import React from 'react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '20',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.brandGreen,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 16,
  },
  notesBox: {
    width: '100%',
    gap: 4,
    backgroundColor: Colors.brandGreen + '08',
    borderRadius: 10,
    padding: 10,
  },
  noteItem: {
    fontSize: 10,
    color: Colors.textPrimary,
    lineHeight: 16,
    opacity: 0.75,
  },
  disclaimer: {
    fontSize: 10,
    color: Colors.textPrimary,
    opacity: 0.4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
