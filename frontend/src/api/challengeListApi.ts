import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PendingChallengeDto {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

export const getPendingChallenges = async (): Promise<PendingChallengeDto[]> => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('토큰이 없습니다.');
  const res = await axios.get('/challenge/pending', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const deleteChallenge = async (challengeId: number): Promise<void> => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('토큰이 없습니다.');
  await axios.delete(`/challenge/${challengeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
