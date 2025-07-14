import React from 'react';
import styled from 'styled-components/native';

const LoginPage = ({ navigation }: any) => {
    return (
        <Container>
            <Card>
                <LogoImage source={require('../assets/signature_icon.png')} />
                <Title>GeunJilGeunJil</Title>
                <SubTitle>목표를 달성하고 성장하세요</SubTitle>

                <Email>이메일</Email>
                <Input placeholder="이메일을 입력하세요." placeholderTextColor="#999" />

                <Password>비밀번호</Password>
                <Input placeholder="비밀번호를 입력하세요." placeholderTextColor="#999" secureTextEntry />

                <PrimaryButton onPress={() => {}}>
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

                <SocialButton bgColor="#FEE500">
                    <Icon source={require('../assets/kakao-icon.png')} />
                    <SocialButtonText>카카오 로그인</SocialButtonText>
                </SocialButton>

                <SocialButton bgColor="#FFFFFF" border>
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

const SocialButton = styled.TouchableOpacity<{ bgColor: string; border?: boolean }>`
    background-color: ${({ bgColor }) => bgColor};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px;
    width: 100%;
    border-radius: 8px;
    margin-top: 12px;
    border: ${({ border }) => (border ? '1px solid #ddd' : 'none')};
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
