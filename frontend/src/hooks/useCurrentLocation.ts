import {useState, useCallback} from 'react';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface Location {
  latitude: number;
  longitude: number;
}

export default function useCurrentLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS는 자동 권한 요청됨
    return true;
  }, []);

  const fetchLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('위치 권한이 필요합니다.');
      Alert.alert('위치 권한이 필요합니다.');
      console.log('[GPS] 위치 권한 거부');
      return;
    }
    Geolocation.getCurrentPosition(
      pos => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setError(null);
        console.log('[GPS] 위치 획득 성공:', pos.coords);
      },
      err => {
        setError(err.message);
        Alert.alert('위치 정보를 가져올 수 없습니다.');
        console.log('[GPS] 위치 획득 실패:', err);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [requestLocationPermission]);

  // 필요하다면 useEffect에서 fetchLocation 자동실행 가능
  // useEffect(() => { fetchLocation(); }, []);

  return {location, error, fetchLocation};
}
