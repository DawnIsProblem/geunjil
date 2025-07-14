import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const LandingPage = ({ navigation }: any) => {
    return (
        <Container
        colors={['#3B80F5', '#611CA1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        >
        <LogoContainer>
            <MainBackgroundCircle />
            <LogoImage source={require('../assets/signature_icon.png')} />
            <AppTitle>GeunJilGeunJil</AppTitle>
            <SubTitle>목표를 달성하고{"\n"}성장하세요</SubTitle>
        </LogoContainer>

        <Card>
            <CardRow>
            <CardBackgoundCircle />
            <Icon name="location-outline" size={30} color="#fff" />
            <CardTextContainer>
                <IconText>위치 기반 챌린지</IconText>
                <SubText>GPS로 정확한 위치 인증</SubText>
            </CardTextContainer>
            </CardRow>
        </Card>

        <Card>
            <CardRow>
            <CardBackgoundCircle />
            <Icon name="trophy-outline" size={30} color="#fff" left={6} />
            <CardTextContainer>
                <IconText>성취 추적</IconText>
                <SubText>실시간 진행상황 모니터링</SubText>
            </CardTextContainer>
            </CardRow>
        </Card>

        <Card>
            <CardRow>
            <CardBackgoundCircle />
            <Icon name="camera-outline" size={30} color="#fff" />
            <CardTextContainer>
                <IconText>위치 기반 챌린지</IconText>
                <SubText>사진으로 성공 순간 기록</SubText>
            </CardTextContainer>
            </CardRow>
        </Card>

        <ButtonContainer onPress={() => navigation.navigate('Login')}>
            <ButtonText>시작하기</ButtonText>
        </ButtonContainer>
        </Container>
    );
};

const Container = styled(LinearGradient)`
    flex: 1;
    align-items: center;
    padding: 24px;
`;

const LogoContainer = styled.View`
    align-items: center;
    margin-bottom: 40px;
    position: relative;
`;

const MainBackgroundCircle = styled.View`
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    position: absolute;
    top: 36px;
`;

const LogoImage = styled.Image`
    width: 69px;
    height: 69px;
    margin-top: 50px;
    margin-bottom: 16px;
    z-index: 1;
`;

const AppTitle = styled.Text`
    font-size: 32px;
    font-weight: bold;
    color: white;
`;

const SubTitle = styled.Text`
    font-size: 20px;
    color: white;
    margin-top: 15px;
    text-align: center;
`;

const CardBackgoundCircle = styled.View`
    width: 60px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    position: absolute;
    left: 30px;
`;

const Card = styled.View`
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 12px;
    margin: 10px;
    width: 330px;
    height: 130px;
    justify-content: center;
`;

const CardRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const CardTextContainer = styled.View`
    margin-left: 25px;
`;

const IconText = styled.Text`
    font-size: 20px;
    color: white;
    font-weight: bold;
`;

const SubText = styled.Text`
    font-size: 16px;
    color: white;
    margin-top: 2px;
`;

const ButtonContainer = styled.TouchableOpacity`
    background-color: white;
    width: 330px;
    height: 50px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
`;

const ButtonText = styled.Text`
    color: #3C82F6;
    font-size: 18px;
    font-weight: bold;
`;

export default LandingPage;
