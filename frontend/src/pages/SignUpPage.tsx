import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Alert} from 'react-native';
import {signupApi} from '../api/signupApi';

const SignUpPage = ({navigation}: any) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const payload = {loginId, password, email, name};
    console.log('회원가입 보낼 데이터:', payload);

    try {
      const result = await signupApi(payload);
      Alert.alert('회원가입 성공!', result.message);
    } catch (error: any) {
      console.log('에러 발생!', error, error?.response);
      Alert.alert(
        '회원가입 실패',
        error?.response?.data?.message || '에러가 발생했습니다.',
      );
    }
  };

  return (
    <Container>
      <Card>
        <LogoImage source={require('../assets/signature_icon.png')} />
        <Title>회원가입</Title>
        <SubTitle>GeunJilGeunJil과 함께 시작하세요.</SubTitle>

        <Field>
          <Label>이메일</Label>
          <Input
            placeholder="이메일을 입력하세요."
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </Field>

        <Field>
          <Label>아이디</Label>
          <Input
            placeholder="아이디를 입력하세요."
            placeholderTextColor="#999"
            value={loginId}
            onChangeText={setLoginId}
          />
        </Field>

        <Field>
          <Label>닉네임</Label>
          <Input
            placeholder="닉네임을 입력하세요."
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field>
          <Label>비밀번호</Label>
          <Input
            placeholder="비밀번호를 입력하세요."
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Field>

        <Field>
          <Label>비밀번호 확인</Label>
          <Input
            placeholder="비밀번호를 다시 입력해주세요."
            placeholderTextColor="#999"
            secureTextEntry
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
          />
        </Field>

        <CheckRow>
          <CheckBox />
          <CheckText>이용약관 및 개인정보처리방침에 동의합니다.</CheckText>
        </CheckRow>

        <PrimaryButton onPress={handleSignup}>
          <PrimaryButtonText>회원가입</PrimaryButtonText>
        </PrimaryButton>

        <Footer>
          <FooterText>이미 계정이 있으신가요?</FooterText>
          <LoginLink onPress={() => navigation.navigate('Login')}>
            <LoginText>로그인</LoginText>
          </LoginLink>
        </Footer>
      </Card>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #eef1fd;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.View`
  width: 100%;
  background-color: white;
  border-radius: 12px;
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

const Field = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.TextInput`
  width: 100%;
  background-color: #f9f9f9;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const CheckRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
`;

const CheckBox = styled.View`
  width: 18px;
  height: 18px;
  border: 1px solid #333;
  border-radius: 4px;
  margin-right: 8px;
`;

const CheckText = styled.Text`
  font-size: 13px;
  flex-shrink: 1;
  color: #333;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #3b80f5;
  padding: 14px 0;
  width: 100%;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 20px;
`;

const PrimaryButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Footer = styled.View`
  flex-direction: row;
`;

const FooterText = styled.Text`
  font-size: 13px;
  color: #333;
`;

const LoginLink = styled.TouchableOpacity`
  margin-left: 4px;
`;

const LoginText = styled.Text`
  font-size: 13px;
  color: #000000;
  font-weight: bold;
`;

export default SignUpPage;
