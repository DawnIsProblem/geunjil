import axios from './axios';

export const deleteAccountApi = async (accessToken: string) => {
  const response = await axios.delete('/mypage/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
