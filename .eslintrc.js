module.exports = {
  root: true,
  extends: 'react-app',
  plugins: ['react-hooks'],
  rules: {
    'comma-dangle': 'off', // 关闭是否使用拖尾逗号
    'no-unused-vars': 'warn',
    'react/no-did-mount-set-state': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
