/**
 * KaabaLayoutDiagram
 *
 * Schematic diagram showing the Kaaba and its key landmarks.
 * Geometric / abstract — no photographs or images of people.
 *
 * Legend:
 *  ■  Kaaba (black cube)
 *  ◆  Hajar al-Aswad (Black Stone) — SE corner
 *  ▲  Rukn al-Yamani (Yemeni Corner) — SW corner
 *  ○  Maqam Ibrahim
 *  ─  Hijr Ismail (semicircular area)
 *  ↺  Counter-clockwise direction of Tawaf
 */
import Svg, {
  Rect,
  Circle,
  Path,
  Text as SvgText,
  G,
  Line,
  Defs,
  Marker,
} from 'react-native-svg';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';

interface LandmarkLabel {
  label: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

export function KaabaLayoutDiagram() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const { width } = useWindowDimensions();

  const W = Math.min(width - 32, 380);
  const H = W * 0.85;
  const cx = W / 2;
  const cy = H / 2;

  // Kaaba square — centered
  const kW = W * 0.22;
  const kH = W * 0.22;
  const kX = cx - kW / 2;
  const kY = cy - kH / 2;

  // Hijr Ismail — semicircle on the north (top) side of the Kaaba
  const hijrR = kW * 0.55;
  const hijrCy = kY - hijrR * 0.05;

  // Key landmarks (in schematic coordinates)
  const hajarX = kX + kW; // SE corner = right bottom
  const hajarY = kY + kH;

  const yamaniX = kX; // SW corner = left bottom
  const yamaniY = kY + kH;

  const maqamX = cx + kW * 0.9; // east of Kaaba
  const maqamY = cy;

  // Tawaf direction arc (counter-clockwise arrow)
  const tawafR = kW * 1.55;

  const labels: LandmarkLabel[] = isAr
    ? [
        { label: 'الحجر الأسود', x: hajarX + 14, y: hajarY + 14, anchor: 'start' },
        { label: 'الركن اليماني', x: yamaniX - 8, y: yamaniY + 14, anchor: 'end' },
        { label: 'مقام إبراهيم', x: maqamX + 12, y: maqamY, anchor: 'start' },
        { label: 'حِجر إسماعيل', x: cx, y: kY - hijrR - 12, anchor: 'middle' },
        { label: 'الكعبة', x: cx, y: cy + 5, anchor: 'middle' },
      ]
    : [
        { label: 'Black Stone', x: hajarX + 14, y: hajarY + 14, anchor: 'start' },
        { label: "Yemeni Corner", x: yamaniX - 8, y: yamaniY + 14, anchor: 'end' },
        { label: "Maqam Ibrahim", x: maqamX + 12, y: maqamY, anchor: 'start' },
        { label: "Hijr Ismail", x: cx, y: kY - hijrR - 12, anchor: 'middle' },
        { label: 'Kaaba', x: cx, y: cy + 5, anchor: 'middle' },
      ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isAr ? 'مخطط الكعبة المشرفة' : 'Kaaba Layout Diagram'}
      </Text>
      <Text style={styles.subtitle}>
        {isAr
          ? '↺ اتجاه الطواف: عكس عقارب الساعة — الكعبة على يسارك دائماً'
          : '↺ Tawaf direction: counter-clockwise — Kaaba always on your left'}
      </Text>

      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* Tawaf direction arc */}
        <Path
          d={`
            M ${cx + tawafR} ${cy}
            A ${tawafR} ${tawafR} 0 1 0 ${cx + tawafR * 0.01} ${cy - tawafR}
          `}
          fill="none"
          stroke={Colors.brandGreen + '30'}
          strokeWidth={18}
          strokeLinecap="round"
        />
        {/* Arrow head for counter-clockwise */}
        <Path
          d={`M ${cx + tawafR * 0.02} ${cy - tawafR}
              L ${cx + tawafR * 0.18} ${cy - tawafR + 14}
              L ${cx - tawafR * 0.08} ${cy - tawafR - 10}`}
          fill={Colors.brandGreen + '50'}
        />

        {/* Hijr Ismail — semicircle (north/top side) */}
        <Path
          d={`
            M ${cx - kW / 2} ${kY}
            A ${hijrR} ${hijrR} 0 0 0 ${cx + kW / 2} ${kY}
          `}
          fill="none"
          stroke={Colors.goldAccent}
          strokeWidth={2}
          strokeDasharray="5,3"
        />

        {/* Kaaba body */}
        <Rect
          x={kX}
          y={kY}
          width={kW}
          height={kH}
          fill="#1a1a1a"
          rx={3}
        />

        {/* Kiswa gold band */}
        <Rect
          x={kX}
          y={kY + kH * 0.35}
          width={kW}
          height={kH * 0.12}
          fill={Colors.goldAccent}
          opacity={0.85}
        />

        {/* Hajar al-Aswad — SE corner (bottom-right) */}
        <Circle cx={hajarX} cy={hajarY} r={7} fill="#5A3E36" />
        <Circle cx={hajarX} cy={hajarY} r={4} fill="#2C1810" />
        <Line
          x1={hajarX}
          y1={hajarY}
          x2={hajarX + 10}
          y2={hajarY + 10}
          stroke="#5A3E36"
          strokeWidth={1}
        />

        {/* Rukn al-Yamani — SW corner (bottom-left) */}
        <Circle cx={yamaniX} cy={yamaniY} r={6} fill={Colors.goldAccent} opacity={0.85} />
        <Line
          x1={yamaniX}
          y1={yamaniY}
          x2={yamaniX - 10}
          y2={yamaniY + 10}
          stroke={Colors.goldAccent}
          strokeWidth={1}
        />

        {/* Maqam Ibrahim */}
        <Rect
          x={maqamX - 7}
          y={maqamY - 9}
          width={14}
          height={18}
          fill={Colors.brandGreen}
          rx={2}
          opacity={0.8}
        />
        <Line
          x1={maqamX}
          y1={maqamY - 9}
          x2={kX + kW}
          y2={cy}
          stroke={Colors.brandGreen}
          strokeWidth={0.8}
          strokeDasharray="4,3"
          opacity={0.35}
        />

        {/* Compass rose — small, top-right */}
        <SvgText
          x={W - 18}
          y={20}
          fontSize={10}
          fill={Colors.textPrimary}
          opacity={0.35}
          textAnchor="middle"
        >
          {isAr ? 'ش' : 'N'}
        </SvgText>
        <Line x1={W - 18} y1={22} x2={W - 18} y2={32} stroke={Colors.textPrimary} strokeWidth={1} opacity={0.25} />

        {/* Labels */}
        {labels.map((lbl) => (
          <SvgText
            key={lbl.label}
            x={lbl.x}
            y={lbl.y}
            fontSize={9.5}
            fill={lbl.label.includes('Kaaba') || lbl.label === 'الكعبة' ? Colors.white : Colors.textPrimary}
            textAnchor={lbl.anchor}
            fontWeight="600"
            opacity={lbl.label.includes('Kaaba') || lbl.label === 'الكعبة' ? 0.9 : 0.85}
          >
            {lbl.label}
          </SvgText>
        ))}

      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color="#1a1a1a" label={isAr ? 'الكعبة' : 'Kaaba'} />
        <LegendItem color="#5A3E36" label={isAr ? 'الحجر الأسود' : 'Black Stone'} />
        <LegendItem color={Colors.goldAccent} label={isAr ? 'الركن اليماني' : 'Yemeni Corner'} />
        <LegendItem color={Colors.brandGreen} label={isAr ? 'مقام إبراهيم' : 'Maqam Ibrahim'} />
        <LegendItem color={Colors.goldAccent} label={isAr ? 'حِجر إسماعيل' : 'Hijr Ismail'} dashed />
      </View>

      <Text style={styles.disclaimer}>
        {isAr
          ? '⚠️ مخطط توضيحي — للاتجاهات العامة فقط'
          : '⚠️ Schematic diagram — for general orientation only'}
      </Text>
    </View>
  );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <View style={legendStyles.row}>
      <View style={[
        legendStyles.dot,
        { backgroundColor: dashed ? 'transparent' : color, borderColor: color },
        dashed && { borderStyle: 'dashed' as any },
      ]} />
      <Text style={legendStyles.label}>{label}</Text>
    </View>
  );
}

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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 10,
    color: Colors.textPrimary,
    opacity: 0.4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const legendStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  label: { fontSize: 9.5, color: Colors.textPrimary, opacity: 0.7 },
});
