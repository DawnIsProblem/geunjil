import axios from './axios';

export const getMainPageInfo = async (accessToken: string) => {
  const response = await axios.get('/main/info', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
