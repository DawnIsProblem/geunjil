import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getChallengeInfo, uploadLocation } from '../api/challengeProgressApi';
import { challengeStop } from '../api/challengeStopApi';
import HeaderProgress from '../components/ChallengeProgressPage/HeaderProgress';
import useCurrentLocation from '../hooks/useCurrentLocation';
import Footer from '../components/Common/Footer';

interface ChallengeProgressPageProps {
  route: { params: { challengeId: number } };
}

const ChallengeProgressPage: React.FC<ChallengeProgressPageProps> = ({
  route,
}) => {
  const { location, fetchLocation } = useCurrentLocation();
  const navigation = useNavigation();
  const challengeId = route.params.challengeId;
  const [inRange, setInRange] = useState<boolean>(true);
  const [challenge, setChallenge] = useState<any>(null);
  const [remainSec, setRemainSec] = useState<number>(0);

  console.log('ChallengeProgressPage opened!', route?.params?.challengeId);
  console.log('ChallengeProgressPage opened!', route.params.challengeId);

  // 1. 챌린지 정보 가져오기 + 위치 최초 요청
  useEffect(() => {
    fetchLocation(); // 진입 시 최초 위치 측정

    const fetchData = async () => {
      try {
        const data = await getChallengeInfo(challengeId);
        setChallenge(data);
        // 남은 시간 계산
        const now = new Date();
        const end = new Date(`${data.day}T${data.endTime}`);
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
    fetchData();
  }, [challengeId, navigation, fetchLocation]);

  // 2. location, challenge가 바뀔 때마다 서버에 위치 전송 + inRange 판정
  useEffect(() => {
    if (!location || !challenge) {
      console.log('[DEBUG] 위치/챌린지 없음:', { location, challenge });
      return;
    }

    const uploadCurrentLocation = async () => {
      const id = challenge.challengeId;
      console.log('[DEBUG] 위치 업로드 시도:', {
        challengeId: id,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      try {
        await uploadLocation(id, location.latitude, location.longitude);
        // 거리 계산(프론트 UI용)
        const dist = getDistanceFromLatLonInM(
          location.latitude,
          location.longitude,
          challenge.lat,
          challenge.lng,
        );
        setInRange(dist <= challenge.radius);
      } catch (e) {
        console.log('[DEBUG] 위치 업로드 실패:', e);
      }
    };
    uploadCurrentLocation();
  }, [location, challenge]);

  // 3. 1분마다 위치 갱신(fetchLocation 호출)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLocation();
    }, 60000); // 60초
    return () => clearInterval(interval);
  }, [fetchLocation]);

  // 시간 포맷팅
  const getRemainTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  const handleStop = async () => {
    Alert.alert('챌린지 중지', '챌린지를 중지하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '중지',
        style: 'destructive',
        onPress: async () => {
          try {
            await challengeStop(challengeId); // 실제 API 호출
            Alert.alert('챌린지가 중지되었습니다!');
            navigation.goBack();
          } catch (e) {
            Alert.alert('챌린지 중지에 실패했습니다.');
          }
        },
      },
    ]);
  };

  function getDistanceFromLatLonInM(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180);
    }
    const R = 6371000; // m
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
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
              fill={(remainSec / (2 * 60 * 60)) * 100}
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
          <InRange>
            <Dot inRange={inRange} />{' '}
            {inRange ? '설정 범위 내에 있습니다.' : '범위 밖입니다!'}
          </InRange>
        </Card>

        <StatusRow>
          <StatusBox>
            <Icon name="cellular-outline" size={28} color="#3B80F5" />
            <StatusLabel>GPS</StatusLabel>
            <StatusValue>{challenge?.gpsStatus ?? '알수없음'}</StatusValue>
          </StatusBox>
          <StatusBox>
            <Icon name="radio-outline" size={28} color="#22C55E" />
            <StatusLabel>반경</StatusLabel>
            <StatusValue>{challenge?.radius ?? 0}m</StatusValue>
          </StatusBox>
          <StatusBox>
            <Icon name="pulse-outline" size={28} color="#A855F7" />
            <StatusLabel>상태</StatusLabel>
            <StatusValue>{challenge?.status ?? ''}</StatusValue>
          </StatusBox>
        </StatusRow>

        <InfoBox>
          <LocLabel>
            <Icon name="location-outline" size={18} color="#3B80F5" />
            위치 정보
          </LocLabel>
          <MapArea>
            <MapText>KaKao Map 활용 지도 표시</MapText>
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

const Wrapper = styled.View`
  flex: 1;
  background: #f8fafc;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Card = styled.View`
  background: #fff;
  margin: 18px 18px 6px 18px;
  border-radius: 20px;
  align-items: center;
  padding: 20px 12px 16px 12px;
  shadow-color: #000;
  shadow-opacity: 0.04;
  shadow-radius: 2px;
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
  font-weight: normal;
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
  margin: 4px 0 8px 0;
`;

const InRange = styled.Text`
  font-size: 15px;
  color: #1d4ed8;
  background: #e0e7ff;
  padding: 6px 12px;
  border-radius: 14px;
  margin-top: 4px;
`;

const Dot = styled.View<{ inRange: boolean }>`
  width: 8px;
  height: 8px;
  background: ${({ inRange }) => (inRange ? '#3B80F5' : '#aaa')};
  border-radius: 4px;
  display: inline-block;
  margin-right: 5px;
`;

const StatusRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 18px 0 18px;
`;

const StatusBox = styled.View`
  background: #fff;
  border-radius: 14px;
  padding: 14px 0;
  flex: 1;
  align-items: center;
  margin: 0 4px;
  shadow-color: #000;
  shadow-opacity: 0.04;
  shadow-radius: 1px;
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
  color: #222;
`;

const InfoBox = styled.View`
  background: #fff;
  border-radius: 14px;
  margin: 20px 18px 0 18px;
  padding: 13px 16px 16px 16px;
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
  height: 90px;
  justify-content: center;
  align-items: center;
`;

const MapText = styled.Text`
  font-size: 17px;
  color: #222;
  font-weight: bold;
`;

const StopBtn = styled.TouchableOpacity`
  margin: 24px 18px 0 18px;
  background: #dc2626;
  border-radius: 10px;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 10px;
`;

const StopBtnText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

export default ChallengeProgressPage;
