import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  title: string;
  date: string;
  time: string;
  location: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ChallengeCard = ({
  title,
  date,
  time,
  location,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <OuterCard>
      <InnerCard>
        <Row>
          <IconBox>
            <Icon name="time-outline" size={32} color="#3b80f5" />
          </IconBox>
          <TextGroup>
            <Title>{title}</Title>
            <DateText>
              <Icon name="calendar-outline" size={14} /> {date}
            </DateText>
            <TimeText>
              <Icon name="time-outline" size={14} /> {time}
            </TimeText>
            <LocationText>
              <Icon name="location-outline" size={14} /> {location}
            </LocationText>
          </TextGroup>
        </Row>
        <ButtonRow>
          <EditBtn onPress={onEdit}>
            <EditText>수정</EditText>
          </EditBtn>
          <DeleteBtn onPress={onDelete}>
            <DeleteText>삭제</DeleteText>
          </DeleteBtn>
        </ButtonRow>
      </InnerCard>
    </OuterCard>
  );
};

const OuterCard = styled.View`
  border-left-width: 6px;
  border-left-color: #3b80f5;
  background: white;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
`;

const InnerCard = styled.View``;

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
  margin-left: 12px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const DateText = styled.Text`
  font-size: 13px;
  color: #555;
  margin-top: 2px;
`;

const TimeText = styled.Text`
  font-size: 13px;
  color: #555;
  margin-top: 2px;
`;

const LocationText = styled.Text`
  font-size: 13px;
  color: #555;
  margin-top: 2px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const EditBtn = styled.TouchableOpacity`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 5px;
  padding: 8px 24px;
  width: 160px;
  align-items: center;
`;

const EditText = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const DeleteBtn = styled.TouchableOpacity`
  border: 1px solid #ac2020;
  border-radius: 5px;
  padding: 8px 24px;
  width: 160px;
  align-items: center;
`;

const DeleteText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #ac2020;
`;

export default ChallengeCard;
