const store = {};
module.exports = {
  __esModule: true,
  default: {
    getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
    setItem: jest.fn((key, val) => { store[key] = val; return Promise.resolve(); }),
    removeItem: jest.fn((key) => { delete store[key]; return Promise.resolve(); }),
  },
};
