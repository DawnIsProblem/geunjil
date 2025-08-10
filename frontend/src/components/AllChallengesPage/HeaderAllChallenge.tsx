import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../types/navigation';

type Navigation = StackNavigationProp<RootStackParamList, 'AllChallenges'>;

const HeaderAllChallenges = () => {
  const navigation = useNavigation<Navigation>();

  return (
    <Container>
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={28} color="#000" />
      </BackButton>
      <Title>진행 예정 챌린지</Title>
      <NewButton onPress={() => navigation.navigate('CreateChallenge')}>
        <Icon name="add" size={24} color="#fff" />
        <AddText>새 챌린지</AddText>
      </NewButton>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  margin-left: -60px;
`;

const NewButton = styled.TouchableOpacity`
  padding: 8px;
  width: 140px;
  height: 45px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #3c82f6;
  flex-direction: row;
`;

const AddText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  margin-left: 4px;
`;

export default HeaderAllChallenges;
