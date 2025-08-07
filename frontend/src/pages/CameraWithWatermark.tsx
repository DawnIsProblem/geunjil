import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styled from 'styled-components/native';

type Props = NativeStackScreenProps<RootStackParamList, 'CameraWithWatermark'>;

const CameraWithWatermark: React.FC<Props> = ({ navigation }) => (
  <Container>
    <Message>카메라 연동 및 워터마크 기능은 개발 예정입니다! 🥲</Message>
    <HomeButton onPress={() => navigation.navigate('Home')}>
      <HomeButtonText>홈으로 돌아가기</HomeButtonText>
    </HomeButton>
  </Container>
);

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: #ffffff;
`;

const Message = styled.Text`
  font-size: 18px;
  text-align: center;
  color: #333333;
  margin-bottom: 32px;
`;

const HomeButton = styled.TouchableOpacity`
  padding: 12px 24px;
  background: #000000;
  border-radius: 8px;
`;

const HomeButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

export default CameraWithWatermark;
