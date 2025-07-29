import React from 'react';
import styled from 'styled-components/native';

interface Props {
  color: string;
  title: string;
  count: number;
}

const StatCard = ({color, title, count}: Props) => (
  <Card>
    <Count style={{color}}>{count}</Count>
    <Title>{title}</Title>
  </Card>
);

const Card = styled.View`
  flex: 1;
  align-items: center;
`;

const Count = styled.Text`
  font-size: 32px;
  font-weight: bold;
`;

const Title = styled.Text`
  margin-top: 4px;
  font-size: 20px;
  color: #555;
  font-weight: bold;
`;

export default StatCard;
