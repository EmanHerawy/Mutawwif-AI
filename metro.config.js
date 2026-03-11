const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolve platforms
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Prefer CJS over ESM to avoid import.meta in .mjs files (e.g. zustand)
// Metro doesn't handle import.meta in CommonJS bundles
config.resolver.unstable_conditionNames = ['require', 'default', 'react-native'];

// Block .mjs resolution — force Metro to use .js (CJS) builds
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== 'mjs'
);

module.exports = config;
