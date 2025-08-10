import React, { useRef, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { getChallengeInfo, uploadLocation } from '../api/challengeProgressApi';
import { challengeStop } from '../api/challengeStopApi';
import HeaderProgress from '../components/ChallengeProgressPage/HeaderProgress';
import useCurrentLocation from '../hooks/useCurrentLocation';
import Footer from '../components/Common/Footer';
import {
  useNavigation,
  useRoute,
  RouteProp,
  StackActions,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type RouteProps = RouteProp<RootStackParamList, 'ChallengeProgress'>;
type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChallengeProgress'
>;

const ChallengeProgressPage: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const challengeId = route.params.challengeId;
  const { location, fetchLocation } = useCurrentLocation();
  const [challenge, setChallenge] = useState<any>(null);
  const [remainSec, setRemainSec] = useState<number>(0);
  const [totalSec, setTotalSec] = useState<number>(0);
  const [inRange, setInRange] = useState<boolean>(true);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'안정' | '불안정'>('불안정');

  useEffect(() => {
    if (location) {
      setGpsStatus('안정');
    } else {
      setGpsStatus('불안정');
    }
  }, [location]);

  const cleanupPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const fetchData = async () => {
    try {
      const data = await getChallengeInfo(challengeId);

      if (data.status === 'SUCCESS') {
        if (pollRef.current) clearInterval(pollRef.current);
        return navigation.dispatch(
          StackActions.replace('ChallengeSuccess', {
            challengeId,
            attempt: data.warningCount + 1,
          }),
        );
      }
      if (data.status === 'FAIL') {
        if (pollRef.current) clearInterval(pollRef.current);
        return navigation.dispatch(
          StackActions.replace('ChallengeFail', {
            attempt: data.warningCount + 1,
          }),
        );
      }

      setChallenge(data);

      const now = new Date();
      const start = new Date(`${data.day}T${data.startTime}`);
      const end = new Date(`${data.day}T${data.endTime}`);

      const total = Math.floor((end.getTime() - start.getTime()) / 1000);
      setTotalSec(total);

      const remain = Math.max(
        0,
        Math.floor((end.getTime() - now.getTime()) / 1000),
      );
      setRemainSec(remain);
    } catch {
      Alert.alert('챌린지 정보를 불러오지 못했습니다.');
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchData();
    pollRef.current = setInterval(fetchData, 5000);
    return cleanupPoll;
  }, [challengeId, fetchLocation]);

  useEffect(() => {
    if (!challenge) return;

    const newRegion: Region = {
      latitude: challenge.lat,
      longitude: challenge.lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setMapRegion(newRegion);

    mapRef.current?.animateToRegion(newRegion, 500);
  }, [challenge?.lat, challenge?.lng]);

  useEffect(() => {
    if (!location || !challenge) return;

    const uploadCurrentLocation = async () => {
      try {
        await uploadLocation(
          challengeId,
          location.latitude,
          location.longitude,
        );
        const dist = getDistanceFromLatLonInM(
          location.latitude,
          location.longitude,
          challenge.lat,
          challenge.lng,
        );
        setInRange(dist <= challenge.radius);
      } catch (e) {
        console.warn('위치 업로드 실패', e);
      }
    };

    uploadCurrentLocation();
  }, [location, challenge]);

  useEffect(() => {
    const locInterval = setInterval(fetchLocation, 60000);
    return () => clearInterval(locInterval);
  }, [fetchLocation]);

  useEffect(() => {
    if (remainSec <= 0) return;
    const timer = setInterval(() => {
      setRemainSec(sec => {
        if (sec <= 1) {
          clearInterval(timer);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainSec]);

  const handleStop = () => {
    Alert.alert('챌린지 중지', '챌린지를 중지하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '중지',
        style: 'destructive',
        onPress: async () => {
          try {
            await challengeStop(challengeId);
            Alert.alert('챌린지가 중지되었습니다!');
            navigation.goBack();
          } catch {
            Alert.alert('챌린지 중지에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const getRemainTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  function getDistanceFromLatLonInM(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const deg2rad = (deg: number) => deg * (Math.PI / 180);
    const R = 6371000;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <Wrapper>
      <HeaderProgress />
      <Content>
        <Card>
          <CircleWrapper>
            <AnimatedCircularProgress
              size={160}
              width={10}
              fill={totalSec > 0 ? (remainSec / totalSec) * 100 : 0}
              tintColor="#3B80F5"
              backgroundColor="#E5E7EB"
              lineCap="round"
            >
              {() => (
                <TimerText>
                  {getRemainTime(remainSec)}
                  {'\n'}
                  <TimerSub>남은 시간</TimerSub>
                </TimerText>
              )}
            </AnimatedCircularProgress>
          </CircleWrapper>
          <CardTitle>{challenge?.title ?? ''}</CardTitle>
          <CardTime>
            {challenge?.startTime ?? ''} ~ {challenge?.endTime ?? ''}
          </CardTime>
          <InRangeWrapper inRange={inRange}>
            <InRangeDot inRange={inRange} />
            <InRangeText inRange={inRange}>
              {inRange
                ? '설정 범위 내에 있습니다.'
                : '설정 범위를 벗어났습니다.'}
            </InRangeText>
          </InRangeWrapper>
        </Card>

        <StatusRow>
          <StatusBox>
            <Icon name="cellular-outline" size={28} color="#3B80F5" />
            <StatusLabel>GPS</StatusLabel>
            <StatusValue>{gpsStatus}</StatusValue>
          </StatusBox>
          <StatusBox>
            <Icon name="radio-outline" size={28} color="#22C55E" />
            <StatusLabel>반경</StatusLabel>
            <StatusValue>{challenge?.radius ?? 0}m</StatusValue>
          </StatusBox>
          <StatusBox>
            <Icon name="pulse-outline" size={28} color="#A855F7" />
            <StatusLabel>상태</StatusLabel>
            <StatusValue>
              {challenge?.status === 'ONGOING'
                ? '진행중'
                : challenge?.status === 'SUCCESS'
                ? '성공'
                : challenge?.status === 'FAIL'
                ? '실패'
                : '-'}
            </StatusValue>
          </StatusBox>
        </StatusRow>

        <InfoBox>
          <LocLabel>
            <Icon name="location-outline" size={18} color="#3B80F5" />
            위치 정보
          </LocLabel>
          <MapArea>
            {challenge?.lat != null && mapRegion && (
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                region={mapRegion}
              >
                <Marker
                  coordinate={{
                    latitude: challenge.lat,
                    longitude: challenge.lng,
                  }}
                />
                <Circle
                  center={{
                    latitude: challenge.lat,
                    longitude: challenge.lng,
                  }}
                  radius={challenge.radius}
                  strokeWidth={2}
                  strokeColor="rgba(59,128,245,0.8)"
                  fillColor="rgba(59,128,245,0.2)"
                />
              </MapView>
            )}
          </MapArea>
        </InfoBox>

        <StopBtn onPress={handleStop}>
          <StopBtnText>■ 챌린지 중지</StopBtnText>
        </StopBtn>
      </Content>
      <Footer />
    </Wrapper>
  );
};

export default ChallengeProgressPage;

const Wrapper = styled.View`
  flex: 1;
  background: #f8fafc;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Card = styled.View`
  background: #fff;
  margin: 18px;
  border-radius: 20px;
  align-items: center;
  padding: 20px;
  elevation: 2;
`;

const CircleWrapper = styled.View`
  margin-bottom: 12px;
`;

const TimerText = styled.Text`
  font-size: 34px;
  font-weight: bold;
  color: #222;
  text-align: center;
`;

const TimerSub = styled.Text`
  font-size: 14px;
  color: #888;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
  color: #222;
`;

const CardTime = styled.Text`
  font-size: 15px;
  color: #4b5563;
  margin: 4px 0 8px;
`;

const InRangeWrapper = styled.View<{ inRange: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ inRange }: { inRange: boolean }) =>
    inRange ? '#DBEAFE' : '#FEE2E2'};
  padding: 8px 16px;
  border-radius: 24px;
`;

const InRangeDot = styled.View<{ inRange: boolean }>`
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: ${({ inRange }: { inRange: boolean }) =>
    inRange ? '#1E40AF' : '#991B1B'};
`;

const InRangeText = styled.Text<{ inRange: boolean }>`
  font-size: 15px;
  font-weight: bold;
  color: ${({ inRange }: { inRange: boolean }) =>
    inRange ? '#1E40AF' : '#991B1B'};
`;

const StatusRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 18px 0;
`;

const StatusBox = styled.View`
  background: #fff;
  border-radius: 14px;
  padding: 14px 0;
  flex: 1;
  align-items: center;
  margin: 0 4px;
  elevation: 1;
`;

const StatusLabel = styled.Text`
  font-size: 13px;
  color: #555;
  margin-top: 8px;
`;

const StatusValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  margin-top: 2px;
`;

const InfoBox = styled.View`
  background: #fff;
  border-radius: 14px;
  margin: 20px 18px 0;
  padding: 16px;
  elevation: 1;
`;

const LocLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3b80f5;
  margin-bottom: 6px;
`;

const MapArea = styled.View`
  background: #f3f4f6;
  border-radius: 10px;
  width: 100%;
  height: 200px;
  margin: 0px 0px 16px;
  overflow: hidden;
`;

const StopBtn = styled.TouchableOpacity`
  margin: 24px 18px 10px;
  background: #dc2626;
  border-radius: 10px;
  align-items: center;
  padding: 16px;
`;

const StopBtnText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
