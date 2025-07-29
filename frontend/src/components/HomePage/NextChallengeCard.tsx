import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  challenge: any;
  navigation: any;
}

const NextChallengeCard = ({challenge, navigation}: Props) => {
  console.log('[NextChallengeCard] props.challenge:', challenge);
  if (!challenge) {
    return (
      <OuterCard>
        <InnerCard>
          <Title>예정된 챌린지가 없습니다.</Title>
        </InnerCard>
      </OuterCard>
    );
  }
  return (
    <OuterCard>
      <InnerCard>
        <Row>
          <IconBox>
            <Icon name="time-outline" size={32} color="#3b80f5" />
          </IconBox>
          <TextGroup>
            <Title>{challenge.title}</Title>
            <SubTitle>{challenge.date}</SubTitle>
            <SubTitle>
              {challenge.startTime} ~ {challenge.endTime}
            </SubTitle>
            <Location>
              <Icon name="location-outline" size={14} color="#555" />
              {challenge.location}
            </Location>
          </TextGroup>
          <EditBtn
            onPress={() =>
              navigation.navigate('ChallengeEdit', {challengeId: challenge.id})
            }>
            <EditText>수정</EditText>
          </EditBtn>
        </Row>
      </InnerCard>
    </OuterCard>
  );
};

const OuterCard = styled.View`
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  padding: 10px;
  width: 384px;
  height: 160px;
  align-items: center;
  justify-content: center;
`;

const InnerCard = styled.View`
  background: #f9fafb;
  border-radius: 14px;
  padding: 16px;
  width: 315px;
  height: 120px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconBox = styled.View`
  background: #dbe9fe;
  border-radius: 14px;
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

const TextGroup = styled.View`
  flex: 1;
  margin-left: 16px;

  justify-content: center;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 2px;
  font-weight: bold;
`;

const Location = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 2px;
  font-weight: bold;
`;

const EditBtn = styled.TouchableOpacity`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 14px;
  background-color: #ffffff;
  width: 60px;
  height: 40px;
`;

const EditText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

export default NextChallengeCard;
