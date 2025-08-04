import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const HeaderProgress = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={28} color="#000" />
      </BackButton>
      <TextContainer>
        <Title>챌린지 진행중</Title>
        <SubTitle>실시간 위치 추적중</SubTitle>
      </TextContainer>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  height: 80px;
  padding: 0 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e4e4e7;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

const TextContainer = styled.View`
  flex-direction: column;
  margin-left: 8px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
  color: #4b5563;
`;

export default HeaderProgress;
