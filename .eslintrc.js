module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    _: true,
    Swiper: true,
    axios: true,
    isDevEnv: true,
    couponDataMap: true,
    cartNumUseForNewIndex: true,
    commonloginstatus: true,
    base: true,
    loxia: true,
    $: true,
    SaSso: true,
    e: true,
    Vue: true,
    newShopLogin: true,
    initOmnitrueEvent: true,
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-var': 0,
    'indent': ["error", 4],
    'quotes': ["error", "double", { "allowTemplateLiterals": true }],
    "semi": ["error", "never"],
    'linebreak-style':  ["error", "windows"],
    'eslint func-names': 0,
    'vars-on-top': 0,
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'no-mixed-operators': 0,
    'radix': 0,
    "eslint-env browser": 0,
  },
};
