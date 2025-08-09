/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// ✅ v22 스타일 (namespaced 경고 없어짐)
const m = getMessaging(getApp());
setBackgroundMessageHandler(m, async remoteMessage => {
  console.log('📩 Background message:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
