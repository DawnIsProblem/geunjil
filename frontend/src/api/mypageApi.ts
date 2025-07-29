import axios from './axios';

export const getMypageInfo = async (accessToken: string) => {
  const res = await axios.get('/mypage/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getMypageRecent3 = async (accessToken: string) => {
  const res = await axios.get('/mypage/me/ch_top3', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
