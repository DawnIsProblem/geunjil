import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigation';

const Footer = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Container>
      <Tab onPress={() => navigation.navigate('Home')}>
        <Icon name="home-outline" size={24} color="#000000" />
        <TabText>Home</TabText>
      </Tab>
      <Tab onPress={() => navigation.navigate('AllChallenges')}>
        <Icon name="add-circle-outline" size={24} color="#000000" />
        <TabText>Challenge</TabText>
      </Tab>
      <Tab onPress={() => navigation.navigate('MyPage')}>
        <Icon name="person-outline" size={24} color="#000000" />
        <TabText>MyPage</TabText>
      </Tab>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 80px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e4e4e7;
`;

const Tab = styled.TouchableOpacity`
  align-items: center;
`;

const TabText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000000;
`;

export default Footer;
