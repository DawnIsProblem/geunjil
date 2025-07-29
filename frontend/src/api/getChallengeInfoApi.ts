import axios from './axios';

export const getChallengeInfo = async (
  challengeId: number,
  accessToken: string,
) => {
  const response = await axios.get(`/challenge/${challengeId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
