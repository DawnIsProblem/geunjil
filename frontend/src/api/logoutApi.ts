import axios from './axios';

export const logoutApi = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};
