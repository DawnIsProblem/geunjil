import { PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

async function ensureNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === 'granted';
  }
  return true;
}

type RegisterArgs = {
  userId: number; // ✅ 서버가 현재 userId를 요구한다면 유지
  accessToken?: string; // 서버가 인증 헤더를 요구하면 넣기
  backendBaseUrl: string;
};

/**
 * 로그인 성공 직후(또는 세션 복구 직후)에 호출!
 * 반환값: 토큰갱신 구독 해제 함수 (로그아웃 때 호출)
 */
export async function registerFcmTokenToServer({
  userId,
  accessToken,
  backendBaseUrl,
}: RegisterArgs) {
  const granted = await ensureNotificationPermission();
  if (!granted) return () => {};

  const app = getApp();
  const m = getMessaging(app);

  // FCM 토큰 발급
  const token = await getToken(m);
  console.log('[FCM] token:', token);

  // 서버 전송 (응답/에러 로깅)
  await fetch(`${backendBaseUrl}/device-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ userId, deviceToken: token }),
  })
    .then(async r => {
      const text = await r.text().catch(() => '');
      console.log('[FCM] register response:', r.status, text);
    })
    .catch(e => {
      console.warn('[FCM] register error:', e);
    });

  // 토큰 갱신 대응
  const unsubscribe = onTokenRefresh(m, async newToken => {
    console.log('[FCM] token refreshed:', newToken);
    try {
      const r = await fetch(`${backendBaseUrl}/device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ userId, deviceToken: newToken }),
      });
      const text = await r.text().catch(() => '');
      console.log('[FCM] refresh response:', r.status, text);
    } catch (e) {
      console.warn('[FCM] refresh error:', e);
    }
  });

  return unsubscribe; // 로그아웃 시 호출해서 정리
}
