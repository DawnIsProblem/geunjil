import axios from './axios';

export interface UpdateChallengePayload {
  title: string;
  startTime: string;
  endTime: string;
  day: string;
  location: string;
  lat: number;
  lng: number;
  radius: number;
}

export const updateChallengeApi = async (
  challengeId: number,
  payload: UpdateChallengePayload,
  accessToken: string,
) => {
  console.log('request payload:', payload);
  console.log('request accessToken:', accessToken);

  const response = await axios.patch(`/challenge/${challengeId}`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
