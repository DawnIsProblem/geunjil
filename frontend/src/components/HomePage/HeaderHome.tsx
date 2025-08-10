// src/components/Common/HeaderHome.tsx

import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMypageInfo } from '../../api/mypageApi';
import { useFocusEffect } from '@react-navigation/native';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';

const HeaderHome: React.FC = () => {
  const [nickname, setNickname] = React.useState<string>('');
  const { location, error, fetchLocation } = useCurrentLocation();
  const [locationText, setLocationText] = React.useState<string>('로딩 중...');

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('로그인 후 이용해주세요');
          return;
        }
        try {
          const res = await getMypageInfo(token);
          setNickname(res.data.nickname);
        } catch {
          Alert.alert('마이페이지 정보 조회 실패');
        }

        await fetchLocation();
      })();
    }, [fetchLocation])
  );

  useEffect(() => {
    if (!location) {
      if (error) setLocationText('위치 불러오기 실패');
      return;
    }
    (async () => {
      try {
        const { latitude, longitude } = location;
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=ko`
        );
        const comps = res.data.results[0].address_components;
  
        const province = comps.find((c: any) =>
          c.types.includes('administrative_area_level_1')
        )?.long_name ?? '알 수 없음';
  
        const cityComp =
          comps.find((c: any) => c.types.includes('administrative_area_level_2')) ||
          comps.find((c: any) => c.types.includes('locality')) ||
          comps.find((c: any) => c.types.includes('sublocality_level_1'));
  
        const city = cityComp?.long_name ?? '알 수 없음';
  
        setLocationText(`${province} ${city}`);
      } catch {
        setLocationText('위치 파싱 실패');
      }
    })();
  }, [location, error]);
  

  return (
    <Container>
      <Profile source={require('../../assets/signature_icon.png')} />
      <TextGroup>
        <Hello>안녕하세요, {nickname}님</Hello>
        <Location>
          <Icon name="location-sharp" size={14} color="#4B5563" />
          {locationText}
        </Location>
      </TextGroup>
      <Icon name="notifications-outline" size={30} color="#4B5563" />
    </Container>
  );
};

export default HeaderHome;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  height: 80px;
  padding: 0 16px;
  background-color: #fff;
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
  margin-top: 2px;
`;
