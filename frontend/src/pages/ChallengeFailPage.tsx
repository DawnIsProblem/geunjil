import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMypageInfo } from '../api/mypageApi';

type FailRouteProp = RouteProp<RootStackParamList, 'ChallengeFail'>;
type FailNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChallengeFail'
>;

const ChallengeFailPage: React.FC = () => {
  const navigation = useNavigation<FailNavProp>();
  const route = useRoute<FailRouteProp>();
  const { attempt } = route.params;

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
      <Title>챌린지 실패 😢</Title>
      <Subtitle>아쉽게 챌린지에 실패했어요…!</Subtitle>

      <Card>
        {stats ? (
          <>
            <AttemptText>
              {stats.totalChallenge}
            </AttemptText>
            <StatusText>Attempt</StatusText>
          </>
        ) : (
          <AttemptText>로딩 중…</AttemptText>
        )}
      </Card>

      <HomeBtn onPress={() => navigation.navigate('Home')}>
        <HomeLabel>홈으로 돌아가기</HomeLabel>
      </HomeBtn>
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
  color: #b91c1c;
  font-weight: bold;
`;
const StatusText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
`;
const HomeBtn = styled.TouchableOpacity`
  width: 100%;
  background: #000;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 16px;
`;
const HomeLabel = styled.Text`
  color: #fff;
  font-size: 16px;
`;

export default ChallengeFailPage;
