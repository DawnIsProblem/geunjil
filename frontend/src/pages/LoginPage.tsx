import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useUserStore } from '../store/userStore';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../api/loginApi';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { BACKEND_BASE_URL, GOOGLE_WEB_CLIENT_ID } from '@env';
import { registerFcmTokenToServer } from '../hooks/notifications';

const KakaoLogin = require('@react-native-seoul/kakao-login');

console.log('GOOGLE_WEB_CLIENT_ID:', GOOGLE_WEB_CLIENT_ID);

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['email', 'profile'],
  offlineAccess: false,
  forceCodeForRefreshToken: false,
});

const LoginPage = ({ navigation }: any) => {
  const { setUser } = useUserStore();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginApi({ loginId, password });
      console.log('로그인 응답 전체:', res?.data);
  
      const root = res?.data ?? {};
      const payload = root.data ?? root;
  
      const accessToken: string | undefined = payload.accessToken;
      const id: number | undefined = payload.id;
  
      if (!accessToken) throw new Error('accessToken이 응답에 없습니다.');
      if (!id) throw new Error('id가 응답에 없습니다.');
  
      await AsyncStorage.setItem('accessToken', accessToken);
  
      setUser({
        id: Number(id),
        name: payload.name ?? '',
        email: payload.email ?? '',
        loginId: payload.loginId ?? loginId,
        provider: String(payload.provider ?? 'LOCAL'),
      });
  
      await registerFcmTokenToServer({
        userId: Number(id),
        accessToken,
        backendBaseUrl: BACKEND_BASE_URL,
      });
  
      Alert.alert('로그인 성공!', root.message || '환영합니다.');
      navigation.navigate('Home');
    } catch (e: any) {
      console.log('로그인 실패:', e, e?.response?.data);
      const serverMsg =
        e?.response?.data?.message ||
        e?.message ||
        '아이디 혹은 비밀번호를 확인하세요.';
      Alert.alert('로그인 실패', serverMsg);
    }
  };  
  
  const handleKakaoLogin = async () => {
    try {
      const result = await KakaoLogin.login();
      console.log('카카오 로그인 결과:', result);

      // 1. 백엔드로 accessToken 전송
      const response = await axios.post(`${BACKEND_BASE_URL}/auth/kakao`, {
        accessToken: result.accessToken,
      });

      // 2. JWT 토큰, 유저 정보 저장
      const { accessToken: jwt, user } = response.data;
      await AsyncStorage.setItem('accessToken', jwt);
      setUser(user);

      await registerFcmTokenToServer({
        userId: user.id,
        accessToken: jwt,
        backendBaseUrl: BACKEND_BASE_URL,
      });

      // 3. 홈 화면 이동
      Alert.alert('로그인 성공!', '카카오 로그인에 성공했습니다.');
      navigation.navigate('Home');
    } catch (e) {
      console.log('카카오 로그인 실패:', e);
      Alert.alert('카카오 로그인 실패', '다시 시도해주세요.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo:', userInfo);

      const idToken = (userInfo as any).idToken;

      if (!idToken) {
        Alert.alert(
          '구글 로그인 실패',
          'idToken이 없습니다. 다시 시도해주세요.',
        );
        return;
      }
      // idToken을 백엔드로 전송
      const response = await axios.post(`${BACKEND_BASE_URL}/auth/google`, {
        idToken,
      });
      const { accessToken: jwt, user } = response.data;
      await AsyncStorage.setItem('accessToken', jwt);
      setUser(user);

      await registerFcmTokenToServer({
        userId: user.id,
        accessToken: jwt,
        backendBaseUrl: BACKEND_BASE_URL,
      });

      Alert.alert('로그인 성공!', '구글 로그인에 성공했습니다.');
      navigation.navigate('Home');
      } catch (error: any) {
      console.log(
        '구글 로그인 에러',
        error,
        error.response?.data,
        error.message,
      );
      Alert.alert('구글 로그인 실패', '다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <Card>
        <LogoImage source={require('../assets/signature_icon.png')} />
        <Title>GeunJilGeunJil</Title>
        <SubTitle>목표를 달성하고 성장하세요</SubTitle>

        <Email>아이디</Email>
        <Input
          placeholder="아이디를 입력해주세요."
          placeholderTextColor="#999"
          value={loginId}
          onChangeText={setLoginId}
        />

        <Password>비밀번호</Password>
        <Input
          placeholder="비밀번호를 입력하세요."
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton onPress={handleLogin}>
          <PrimaryButtonText>로그인</PrimaryButtonText>
        </PrimaryButton>

        <Row>
          <SmallButton onPress={() => navigation.navigate('SignUp')}>
            <SmallButtonText>회원가입</SmallButtonText>
          </SmallButton>
          <SmallButton>
            <SmallButtonText>비밀번호 찾기</SmallButtonText>
          </SmallButton>
        </Row>

        <Divider />

        <SocialButton bgColor="#FEE500" onPress={handleKakaoLogin}>
          <Icon source={require('../assets/kakao-icon.png')} />
          <SocialButtonText>카카오 로그인</SocialButtonText>
        </SocialButton>

        <SocialButton bgColor="#FFFFFF" border onPress={handleGoogleLogin}>
          <Icon source={require('../assets/google-icon.png')} />
          <SocialButtonTextBlack>구글 로그인</SocialButtonTextBlack>
        </SocialButton>
      </Card>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #e8edfd;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Card = styled.View`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 30px 20px;
  align-items: center;
`;

const LogoImage = styled.Image`
  width: 69px;
  height: 69px;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  color: #4b5563;
  text-align: center;
  margin: 8px 0 24px;
`;

const Email = styled.Text`
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 5px;
`;

const Password = styled.Text`
  font-weight: bold;
  align-self: flex-start;
  margin-top: 8px;
  margin-bottom: 5px;
`;

const Input = styled.TextInput`
  width: 100%;
  background-color: #f9f9f9;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #3b80f5;
  padding: 14px 0;
  width: 100%;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const PrimaryButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 12px 0;
`;

const SmallButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #ffffff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin: 0 4px;
  justify-content: center;
  align-items: center;
`;

const SmallButtonText = styled.Text`
  color: #333;
  font-size: 13px;
  font-weight: bold;
`;

const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin: 16px 0;
`;

interface SocialButtonProps {
  bgColor: string;
  border?: boolean;
}

const SocialButton = styled.TouchableOpacity<SocialButtonProps>`
  background-color: ${(props: SocialButtonProps) => props.bgColor};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  margin-top: 12px;
  border: ${(props: SocialButtonProps) =>
    props.border ? '1px solid #ddd' : 'none'};
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const SocialButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #000;
`;

const SocialButtonTextBlack = styled(SocialButtonText)`
  color: #000;
`;

export default LoginPage;
