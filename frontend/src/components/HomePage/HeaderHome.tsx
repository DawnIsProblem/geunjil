import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  title?: string;
  showProfile?: boolean;
}

const Header = ({title, showProfile = true}: Props) => {
  return (
    <Container>
      {showProfile ? (
        <>
          <Profile source={require('../../assets/signature_icon.png')} />
          <TextGroup>
            <Hello>안녕하세요, 이정훈님</Hello>
            <Location>
              <Icon name="location-sharp" size={14} color="#4B5563" />
              익산, 대한민국
            </Location>
          </TextGroup>
          <Icon name="notifications-outline" size={30} color="#4B5563" />
        </>
      ) : (
        <Title>{title}</Title>
      )}
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

const Profile = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 16px;
`;

const TextGroup = styled.View`
  flex: 1;
  margin-left: 8px;
`;

const Hello = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const Location = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #999;
  top: 5px;
`;

const Title = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
`;

export default Header;
