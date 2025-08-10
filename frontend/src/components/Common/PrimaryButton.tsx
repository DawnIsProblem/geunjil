import React from 'react';
import styled from 'styled-components/native';

interface Props {
  title: string;
  onPress: () => void;
}

const PrimaryButton = ({title, onPress}: Props) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonText>{title}</ButtonText>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.TouchableOpacity`
  background-color: white;
  padding: 14px 0;
  width: 330px;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  margin-top: 12px;
`;

const ButtonText = styled.Text`
  color: #3c82f6;
  font-size: 18px;
  font-weight: bold;
`;

export default PrimaryButton;
