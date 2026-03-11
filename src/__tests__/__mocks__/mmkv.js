const store = {};
module.exports = {
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn((key, val) => { store[key] = val; }),
    getString: jest.fn((key) => store[key]),
    delete: jest.fn((key) => { delete store[key]; }),
  })),
};
