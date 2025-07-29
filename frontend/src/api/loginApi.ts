import axios from './axios';

interface LoginPayLoad {
  loginId: string;
  password: string;
}

export const loginApi = async (payload: LoginPayLoad) => {
  const response = await axios.post('/user/login', payload);
  return response.data;
};
