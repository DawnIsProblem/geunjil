import React from 'react';
import styled from 'styled-components/native';

export type ChallengeStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'STOPED'
  | 'FAIL'
  | 'ONGOING';

const statusToKor = (status: ChallengeStatus): string => {
  switch (status) {
    case 'SUCCESS':
      return '성공';
    case 'STOPED':
      return '중단';
    case 'FAIL':
      return '실패';
    case 'PENDING':
      return '대기';
    case 'ONGOING':
      return '진행';
    default:
      return '';
  }
};

interface RecentChallengeCardProps {
  title: string;
  date: string;
  status: ChallengeStatus;
}

interface StatusProps {
  status: ChallengeStatus;
}

const RecentChallengeCard = ({
  title,
  date,
  status,
}: RecentChallengeCardProps) => {
  return (
    <Card>
      <Left>
        <Title>{title}</Title>
        <Date>{date}</Date>
      </Left>
      <StatusBox status={status}>
        <StatusText status={status}>{statusToKor(status)}</StatusText>
      </StatusBox>
    </Card>
  );
};

const Card = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 14px;
  border-radius: 8px;
  margin: 6px 0;
  height: 80px;
`;

const Left = styled.View`
  flex-direction: column;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const Date = styled.Text`
  font-size: 14px;
  color: #555;
`;

const StatusBox = styled.View<StatusProps>(props => ({
  backgroundColor:
    props.status === 'SUCCESS'
      ? '#DCFCE7'
      : props.status === 'STOPED'
      ? '#FFF4D7'
      : props.status === 'PENDING'
      ? '#E4E4E7'
      : props.status === 'ONGOING'
      ? '#DBE9FE'
      : '#FFEAEA',
  borderRadius: 15,
  width: 50,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
}));

const StatusText = styled.Text<StatusProps>(props => ({
  fontSize: 14,
  fontWeight: 'bold',
  color:
    props.status === 'SUCCESS'
      ? '#43965C'
      : props.status === 'STOPED'
      ? '#CA8A03'
      : props.status === 'PENDING'
      ? '#000000'
      : props.status === 'ONGOING'
      ? '#2453D9'
      : '#AC2020',
}));

export default RecentChallengeCard;
