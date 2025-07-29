import axios from './axios';

export const updateChallenge = async (
  challengeId: number,
  payload: any,
  accessToken: string,
) => {
  const response = await axios.patch(`/challenge/${challengeId}`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
