import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BACKEND_BASE_URL} from '@env';

export const challengeStop = async (challengeId: number) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = `${BACKEND_BASE_URL}/challenge/stop?challengeId=${challengeId}`;

  const res = await axios.patch(url, null, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return res.data;
};
