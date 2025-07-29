import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

const CalendarPicker = () => {
  return (
    <Container>
      <Icon name="calendar-outline" size={24} color="#333" />
      <Label>날짜 선택</Label>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
`;

const Label = styled.Text`
  margin-left: 8px;
  font-size: 14px;
`;

export default CalendarPicker;
