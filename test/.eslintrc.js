module.exports = {
  extends: ['../.eslintrc.js', 'plugin:jest/recommended'],
  plugins: ['jest'],
  env: {
    'jest/globals': true,
  },
};
