import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BACKEND_BASE_URL} from '@env';

export const getChallengeInfo = async (challengeId: number) => {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await axios.get(
    `${BACKEND_BASE_URL}/challenge/${challengeId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
  return res.data.data;
};

export const uploadLocation = async (
  challengeId: number,
  latitude: number,
  longitude: number,
) => {
  const token = await AsyncStorage.getItem('accessToken');
  try {
    const res = await axios.post(
      `${BACKEND_BASE_URL}/challenge/${challengeId}/location`,
      {lat: latitude, lng:longitude},
      {headers: {Authorization: `Bearer ${token}`}},
    );
    console.log('[API] 위치 서버 전송 성공:', {lat:latitude, lng:longitude}, res.status);
  } catch (error) {
    console.log('[API] 위치 서버 전송 실패:', error);
    throw error;
  }
};
