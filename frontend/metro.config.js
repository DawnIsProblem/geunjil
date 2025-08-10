const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  // 👈 여기는 빈 객체로 두세요. 아무런 조작도 하지 마세요.
});