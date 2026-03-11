module.exports = {
  Platform: { OS: 'ios', select: (obj) => obj.ios ?? obj.default },
  I18nManager: { isRTL: false, allowRTL: jest.fn(), forceRTL: jest.fn() },
  StyleSheet: { create: (s) => s },
};
