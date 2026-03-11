module.exports = {
  default: { fetch: jest.fn().mockResolvedValue({ isConnected: true }) },
  fetch: jest.fn().mockResolvedValue({ isConnected: true }),
};
