import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMypageInfo } from '../api/mypageApi';

type SuccessRouteProp = RouteProp<RootStackParamList, 'ChallengeSuccess'>;
type SuccessNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChallengeSuccess'
>;

const ChallengeSuccessPage: React.FC = () => {
  const navigation = useNavigation<SuccessNavProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'ChallengeSuccess'>>();
  const { attempt, challengeId } = route.params;

  const [stats, setStats] = useState<{
    successChallenge: number;
    totalChallenge: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await getMypageInfo(token);
        setStats({
          successChallenge: res.data.successChallenge,
          totalChallenge: res.data.totalChallenge,
        });
      } catch (e) {
        console.warn('마이페이지 정보 조회 실패', e);
      }
    })();
  }, []);

  return (
    <Container>
      <IconOverlay>
        <BlueCircle />
        <BlackCircle />
      </IconOverlay>
      <Title>챌린지 성공!</Title>
      <Subtitle>기록을 확인하고 인증 사진을 찍어보세요!</Subtitle>

      <Card>
        {stats ? (
          <>
            <AttemptText>{stats.successChallenge}</AttemptText>
            <StatusText>SUCCESS</StatusText>
          </>
        ) : (
          <AttemptText>로딩 중…</AttemptText>
        )}
      </Card>
      <ActionButton
        onPress={() =>
          navigation.navigate('CameraWithWatermark', { challengeId })
        }
      >
        <Icon name="camera-outline" size={20} color="#000" />
        <ButtonLabel>인증 사진 촬영</ButtonLabel>
      </ActionButton>

      <HomeButton onPress={() => navigation.navigate('Home')}>
        <Icon name="home-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <HomeLabel>홈으로 돌아가기</HomeLabel>
      </HomeButton>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background: #eef2ff;
  align-items: center;
  padding: 40px 20px;
`;
const IconOverlay = styled.View`
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  position: relative;
`;
const BlueCircle = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  background: #3b80f5;
  border-radius: 24px;
`;
const BlackCircle = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 48px;
  height: 48px;
  background: #000;
  border-radius: 24px;
`;
const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
`;
const Subtitle = styled.Text`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 24px;
`;
const Card = styled.View`
  width: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 24px;
`;
const AttemptText = styled.Text`
  font-size: 24px;
  color: #3b80f5;
  font-weight: bold;
`;
const StatusText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
`;
const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 16px;
  width: 100%;
`;

const ButtonLabel = styled.Text`
  font-size: 16px;
  margin-left: 8px;
`;
const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 16px;
  width: 100%;
`;

const HomeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #000;
  padding: 14px;
  border-radius: 8px;
  margin-top: 8px;
`;

const HomeLabel = styled.Text`
  color: #fff;
  font-size: 16px;
`;

export default ChallengeSuccessPage;
