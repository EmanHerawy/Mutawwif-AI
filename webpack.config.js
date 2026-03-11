const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['expo-router'] },
    },
    argv
  );

  // Tell expo-router where the app directory is
  config.plugins.forEach((plugin) => {
    if (plugin.definitions) {
      plugin.definitions['process.env.EXPO_ROUTER_APP_ROOT'] = JSON.stringify(
        path.join(__dirname, 'app')
      );
    }
  });

  return config;
};
