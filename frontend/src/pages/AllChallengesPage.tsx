import React from 'react';
import styled from 'styled-components/native';
import HeaderAllChallenge from '../components/AllChallengesPage/HeaderAllChallenge';
import Footer from '../components/Common/Footer';
import ChallengeCard from '../components/AllChallengesPage/ChallengeCard';
import AuthGuard from '../components/Common/AuthGuard';

const AllChallengesPage = () => {
  return (
    <AuthGuard>
      <Container>
        <HeaderAllChallenge />

        <Scroll>
          <Title>진행 예정 챌린지</Title>

          <ChallengeCard
            title="나의 챌린지 1"
            date="2025-07-07"
            time="19:00 ~ 20:00"
            location="근질근질 운동장"
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <ChallengeCard
            title="나의 챌린지 2"
            date="2025-07-08"
            time="19:00 ~ 20:00"
            location="근질근질 운동장"
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <ChallengeCard
            title="나의 챌린지 3"
            date="2025-07-09"
            time="19:00 ~ 20:00"
            location="근질근질 운동장"
            onEdit={() => {}}
            onDelete={() => {}}
          />
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

export default AllChallengesPage;
