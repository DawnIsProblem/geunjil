import React, {useState, useEffect} from 'react';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getChallengeInfo} from '../api/getChallengeInfoApi';
import {updateChallenge} from '../api/editChallengeInfoApi'; // 직접 만든 api import 추가
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderCreate from '../components/EditChallengePage/HeaderEdit';
import LocationInput from '../components/CreateChallengePage/LocationInput';
import Footer from '../components/Common/Footer';
import {Modal, Alert} from 'react-native';
import WebView from 'react-native-webview';
import type {NativeSyntheticEvent} from 'react-native';
import {RootStackParamList} from '../types/navigation';
import styled from 'styled-components/native';
import AuthGuard from '../components/Common/AuthGuard';

type WebViewMessageEvent = NativeSyntheticEvent<{data: string}>;
type ChallengeEditRouteProp = RouteProp<RootStackParamList, 'ChallengeEdit'>;

const EditChallengePage = () => {
  const route = useRoute<ChallengeEditRouteProp>();
  const navigation = useNavigation();
  const challengeId = route.params?.challengeId;

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  const [date, setDate] = useState<Date | undefined>();
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [radius, setRadius] = useState<number | undefined>();
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  console.log('[EditChallengePage] challengeId:', challengeId);

  useEffect(() => {
    console.log('challengeId:', challengeId);

    const fetchChallenge = async () => {
      if (!challengeId) {
        return;
      }
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }
      try {
        const res = await getChallengeInfo(challengeId, accessToken);
        const info = res.data;
        setTitle(info.title);
        setStartTime(new Date(`${info.day}T${info.startTime}`));
        setEndTime(new Date(`${info.day}T${info.endTime}`));
        setDate(new Date(info.day));
        setAddress(info.location);
        setLat(info.lat);
        setLng(info.lng);
        setRadius(Number(info.radius));
      } catch (e) {
        console.log('챌린지 상세 불러오기 에러', e);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  const handleRadiusChange = (text: string) => {
    if (text === '') {
      setRadius(undefined);
    } else {
      setRadius(Number(text));
    }
  };

  const handleEditSubmit = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken || !challengeId) {
      return;
    }
    try {
      await updateChallenge(
        challengeId,
        {
          title,
          startTime: startTime?.toTimeString().slice(0, 8),
          endTime: endTime?.toTimeString().slice(0, 8),
          day: date?.toISOString().slice(0, 10),
          location: address,
          lat,
          lng,
          radius: Number(radius),
        },
        accessToken,
      );
      Alert.alert('수정이 완료되었습니다!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('수정 실패!');
      console.log('수정 실패', err);
    }
  };

  return (
    <AuthGuard>
      <Wrapper>
        <HeaderCreate />
        <ContentContainer>
          <Content>
            <Box>
              <SectionTitle>날짜 설정</SectionTitle>

              <Label>챌린지 타이틀</Label>
              <Input
                placeholder="예: 하체하는 날"
                value={title}
                onChangeText={setTitle}
              />

              <TimeRow>
                <TimeColumn>
                  <Label>시작 시간</Label>
                  <TimeField onPress={() => setShowStartTimePicker(true)}>
                    <TimeText>
                      {startTime
                        ? startTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </TimeText>
                    <Icon name="time-outline" size={20} color="#888" />
                  </TimeField>
                </TimeColumn>

                <TimeColumn>
                  <Label>종료 시간</Label>
                  <TimeField onPress={() => setShowEndTimePicker(true)}>
                    <TimeText>
                      {endTime
                        ? endTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </TimeText>
                    <Icon name="time-outline" size={20} color="#888" />
                  </TimeField>
                </TimeColumn>
              </TimeRow>

              <Label>날짜</Label>
              <DateSelector onPress={() => setShowDatePicker(true)}>
                <Icon name="calendar-outline" size={20} color="#333" />
                <DateText>
                  {date ? date.toLocaleDateString() : '날짜 선택'}
                </DateText>
              </DateSelector>
            </Box>

            <Box>
              <SectionTitle>위치 설정</SectionTitle>

              <Label>활동 지역</Label>
              <Input
                placeholder="주소를 입력하세요"
                value={address}
                onFocus={() => setShowAddressModal(true)}
                editable={false}
              />

              <Label>활동 반경(미터)</Label>
              <Input
                placeholder="예: 500"
                keyboardType="numeric"
                value={radius !== undefined ? String(radius) : ''}
                onChangeText={handleRadiusChange}
              />
              <LocationInput />
            </Box>

            <SelectButtonRow>
              <CancelBtn>
                <BtnText>취소</BtnText>
              </CancelBtn>
              <CreateBtn onPress={handleEditSubmit}>
                <BtnTextWhite>수정 완료</BtnTextWhite>
              </CreateBtn>
            </SelectButtonRow>
          </Content>
        </ContentContainer>

        <Footer />

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(event: any, selectedDate?: Date) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            display="spinner"
            onChange={(event: any, selectedDate?: Date) => {
              setShowStartTimePicker(false);
              if (selectedDate) {
                setStartTime(selectedDate);
              }
            }}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            display="spinner"
            onChange={(event: any, selectedDate?: Date) => {
              setShowEndTimePicker(false);
              if (selectedDate) {
                setEndTime(selectedDate);
              }
            }}
          />
        )}

        <Modal visible={showAddressModal} animationType="slide">
          <WebView
            source={{uri: 'https://postcode.map.daum.net/search'}}
            onMessage={(event: WebViewMessageEvent) => {
              setAddress(event.nativeEvent.data);
              setShowAddressModal(false);
            }}
          />

          <CancelBtn onPress={() => setShowAddressModal(false)}>
            <BtnText>닫기</BtnText>
          </CancelBtn>
        </Modal>
      </Wrapper>
    </AuthGuard>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background-color: #f8fafc;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const Content = styled.ScrollView`
  padding: 20px;
`;

const Box = styled.View`
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e4e4e7;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const Input = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`;

const TimeRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const TimeColumn = styled.View`
  flex: 1;
`;

const TimeField = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: #fff;
`;

const TimeText = styled.Text`
  font-size: 14px;
  color: #333;
`;

const DateSelector = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const DateText = styled.Text`
  margin-left: 8px;
  font-size: 14px;
`;

const SelectButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  left: -20px;
  margin-bottom: 30px;
  margin-top: -20px;
  width: 410px;
`;

const CancelBtn = styled.TouchableOpacity`
  background: #ffffff;
  flex: 0.48;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e4e4e7;
  align-items: center;
  height: 50px;
`;

const CreateBtn = styled.TouchableOpacity`
  background: #3b80f5;
  flex: 0.48;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  height: 50px;
`;

const BtnText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const BtnTextWhite = styled(BtnText)`
  color: #ffffff;
`;

export default EditChallengePage;
