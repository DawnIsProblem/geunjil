import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const HeaderEdit = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={28} color="#000" />
      </BackButton>
      <Title>챌린지 수정하기</Title>
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

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;
`;

export default HeaderEdit;
