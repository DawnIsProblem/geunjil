import axios from './axios';

interface SignupPayLoad {
  loginId: string;
  password: string;
  email: string;
  name: string;
}

export const signupApi = async (payload: SignupPayLoad) => {
  const response = await axios.post('/user/signup', payload);
  return response.data;
};
