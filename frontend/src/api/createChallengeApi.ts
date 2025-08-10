import axios from './axios';

export interface CreateChallengePayload {
  title: string;
  startTime: string;
  endTime: string;
  day: string;
  location: string;
  lat: number;
  lng: number;
  radius: number;
}

export const createChallengeApi = async (
  payload: CreateChallengePayload,
  accessToken: string,
) => {
  console.log('request payload:', payload);
  console.log('request accessToken:', accessToken);

  const response = await axios.post('/challenge', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
