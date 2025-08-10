import React from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import HeaderAllChallenge from '../components/AllChallengesPage/HeaderAllChallenge';
import Footer from '../components/Common/Footer';
import ChallengeCard from '../components/AllChallengesPage/ChallengeCard';
import AuthGuard from '../components/Common/AuthGuard';
import {
  getPendingChallenges,
  deleteChallenge,
  PendingChallengeDto,
} from '../api/challengeListApi';
import type { RootStackParamList } from '../types/navigation';

type AllChallengesNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'AllChallenges'
>;

const AllChallengesPage: React.FC = () => {
  const navigation = useNavigation<AllChallengesNavProp>();
  const [pendingList, setPendingList] = React.useState<PendingChallengeDto[]>([]);

  const fetchList = React.useCallback(async () => {
    try {
      const list = await getPendingChallenges();
      setPendingList(list);
    } catch (err) {
      console.warn('PENDING 챌린지 불러오기 실패', err);
      setPendingList([]);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchList();
    }, [fetchList])
  );

  const onEdit = (id: number) => {
    navigation.navigate('ChallengeEdit', { challengeId: id });
  };

  const onDelete = (id: number) => {
    Alert.alert('챌린지 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteChallenge(id);
            Alert.alert('삭제되었습니다');
            fetchList();
          } catch (err) {
            console.warn('챌린지 삭제 실패', err);
            Alert.alert('삭제에 실패했습니다');
          }
        },
      },
    ]);
  };

  return (
    <AuthGuard>
      <Container>
        <HeaderAllChallenge />

        <Scroll>
          <Title>진행 예정 챌린지</Title>

          {pendingList.length === 0 && (
            <EmptyText>진행 예정인 챌린지가 없습니다.</EmptyText>
          )}

          {pendingList.map(ch => (
            <ChallengeCard
              key={ch.id}
              title={ch.title}
              date={ch.date}
              time={`${ch.startTime} ~ ${ch.endTime}`}
              location={ch.location}
              onEdit={() => onEdit(ch.id)}
              onDelete={() => onDelete(ch.id)}
            />
          ))}
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

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: #888;
  margin-top: 40px;
`;

export default AllChallengesPage;
