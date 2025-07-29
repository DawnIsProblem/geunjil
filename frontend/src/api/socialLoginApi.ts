import axios from './axios';

export const getSocialLoginUrl = async (provider: 'KAKAO' | 'GOOGLE') => {
  const response = await axios.get(`/auth/${provider}`);
  return response.data;
};

export const socialLoginCallback = async (
  provider: 'KAKAO' | 'GOOGLE',
  code: string,
) => {
  const response = await axios.get(`auth/${provider}/callback?code=${code}`);
  return response.data;
};
