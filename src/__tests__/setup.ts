// Global test setup — runs before each test file in both unit and component configs.

// Silence non-critical console noise
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Anthropic SDK mock (used by claudeService.test.ts)
jest.mock('@anthropic-ai/sdk', () => {
  const mockStream = {
    [Symbol.asyncIterator]: () => ({
      next: () => Promise.resolve({ done: true, value: undefined }),
    }),
  };
  function MockAnthropic(this: { messages: unknown }) {
    this.messages = { stream: jest.fn().mockReturnValue(mockStream) };
  }
  return { __esModule: true, default: MockAnthropic };
});

// expo-sms
jest.mock('expo-sms', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  sendSMSAsync: jest.fn().mockResolvedValue({ result: 'sent' }),
}));

// expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
}));

// expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success' },
}));
