module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
      modules: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
