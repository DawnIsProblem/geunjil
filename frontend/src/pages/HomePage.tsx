import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import Header from '../components/HomePage/HeaderHome';
import Footer from '../components/Common/Footer';
import ProgressBar from '../components/HomePage/ProgressBar';
import NextChallengeCard from '../components/HomePage/NextChallengeCard';
import StatCard from '../components/HomePage/StatCard';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthGuard from '../components/Common/AuthGuard';
import { TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useMainInfoStore } from '../store/mainInfoStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomePage = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const mainInfo = useMainInfoStore(state => state.mainInfo);
  const fetchMainInfo = useMainInfoStore(state => state.fetchMainInfo);

  useFocusEffect(
    React.useCallback(() => {
      fetchMainInfo();
    }, [fetchMainInfo]),
  );

  useEffect(() => {
    fetchMainInfo();
  }, [fetchMainInfo]);

  useEffect(() => {
    const interval = setInterval(fetchMainInfo, 5000);
    return () => clearInterval(interval);
  }, [fetchMainInfo]);

  if (!mainInfo) {
    return (
      <Container>
        <Title>로딩중...</Title>
      </Container>
    );
  }

  const current = mainInfo.currentChallenge;
  const next = mainInfo.nextChallenge;
  const result = mainInfo.result;

  console.log('current:', current);

  return (
    <AuthGuard>
      <Container>
        <Header />
        <Scroll>
          {current?.id ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChallengeProgress', {
                  challengeId: current.id,
                })
              }
            >
              <ProgressCard
                colors={['#3B81F5', '#4E47E6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Title>진행 중인 챌린지</Title>
                <SubTitle>{current.title}</SubTitle>
                <Time>
                  {current.startTime} ~ {current.endTime}
                </Time>
                <Location>
                  <Icon name="location-outline" size={16} color="#fff" />{' '}
                  {current.location}
                </Location>
                <ProgressBar percent={current.progressPercent} />
                <Percent>{current.progressPercent}% 완료</Percent>
              </ProgressCard>
            </TouchableOpacity>
          ) : (
            <ProgressCard
              colors={['#3B81F5', '#4E47E6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <EmptyWrapper>
                <EmptyText>현재 진행중인 챌린지가 없어요 🥲</EmptyText>
              </EmptyWrapper>
            </ProgressCard>
          )}

          <SectionTitle>다음 챌린지</SectionTitle>
          <NextChallengeCard challenge={next} navigation={navigation} />

          <SectionTitle>성과</SectionTitle>
          <Result>
            <StatRow>
              <StatCard
                color="#22c55e"
                title="성공"
                count={result?.success ?? 0}
              />
              <StatCard
                color="#fbbf24"
                title="중단"
                count={result?.stoped ?? 0}
              />
              <StatCard
                color="#ef4444"
                title="실패"
                count={result?.fail ?? 0}
              />
            </StatRow>
          </Result>

          <SectionTitle>빠른 액션</SectionTitle>
          <QuickAction onPress={() => navigation.navigate('CreateChallenge')}>
            <Plus>＋</Plus>
            <QuickText>챌린지 생성</QuickText>
          </QuickAction>
        </Scroll>
        <Footer />
      </Container>
    </AuthGuard>
  );
};

const Container = styled.View`
  flex: 1;
  background: #f9fafb;
`;

const Scroll = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const ProgressCard = styled(LinearGradient)`
  border-radius: 14px;
  padding: 16px;
`;

const EmptyWrapper = styled.View`
  flex: 1;
  height: 160px;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const Title = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const SubTitle = styled.Text`
  color: white;
  font-size: 18px;
  margin-top: 4px;
  font-weight: bold;
`;

const Time = styled.Text`
  color: white;
  font-size: 16px;
  margin-top: 4px;
  font-weight: bold;
`;

const Location = styled.Text`
  color: white;
  font-size: 16px;
  margin-top: 4px;
  font-weight: bold;
`;

const Percent = styled.Text`
  color: white;
  font-size: 14px;
  margin-top: 8px;
  font-weight: bold;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 12px 0 8px;
`;

const Result = styled.View`
  background-color: #ffffff;
  height: 114px;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
`;

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  justify-content: center;
  align-item: center;
`;

const QuickAction = styled.TouchableOpacity`
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px;
  height: 90px;
  margin-bottom: 40px;
`;

const QuickText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-left: 8px;
`;

const Plus = styled.Text`
  color: #000000;
  font-size: 18px;
`;

export default HomePage;
