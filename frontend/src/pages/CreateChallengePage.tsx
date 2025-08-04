import React, {useState} from 'react';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderCreate from '../components/CreateChallengePage/HeaderCreate';
import Footer from '../components/Common/Footer';
import {Modal, TouchableOpacity, Alert} from 'react-native';
import AuthGuard from '../components/Common/AuthGuard';
import PlaceSearchInput from '../components/CreateChallengePage/PlaceSearchInput';
import MapView, {Marker, Circle} from 'react-native-maps';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {createChallengeApi} from '../api/createChallengeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateChallengePage = () => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  const [date, setDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [radius, setRadius] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleCreate = async () => {
    if (
      !title ||
      !startTime ||
      !endTime ||
      !date ||
      !address ||
      !lat ||
      !lng ||
      !radius
    ) {
      Alert.alert('모든 필드를 입력해주세요!');
      return;
    }

    // 토큰 꺼내기
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log('accessToken:', accessToken);
    if (!accessToken) {
      Alert.alert('로그인이 필요합니다. 다시 로그인 해주세요.');
      return;
    }

    try {
      await createChallengeApi(
        {
          title,
          startTime: startTime.toLocaleTimeString('en-GB', {hour12: false}),
          endTime: endTime.toLocaleTimeString('en-GB', {hour12: false}),
          day: date.toISOString().split('T')[0],
          location: address,
          lat,
          lng,
          radius,
        },
        accessToken,
      );
      Alert.alert('챌린지 생성 성공!', '', [
        {text: '확인', onPress: () => navigation.navigate('Home')},
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert(
        '챌린지 생성 실패',
        e?.response?.data?.message || '다시 시도해 주세요.',
      );
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
              <TouchableOpacity onPress={() => setShowPlaceModal(true)}>
                <Input
                  pointerEvents="none"
                  editable={false}
                  value={address}
                  placeholder="주소 또는 장소를 검색하세요"
                />
              </TouchableOpacity>

              <Label>활동 반경(미터)</Label>
              <Input
                placeholder="예: 500"
                keyboardType="numeric"
                value={
                  radius !== null && radius !== undefined ? String(radius) : ''
                }
                onChangeText={(text: string) =>
                  setRadius(text ? Number(text) : null)
                }
              />

              {console.log('[지도좌표]', lat, lng)}

              <MapBox
                initialRegion={{
                  latitude: 37.5665,
                  longitude: 126.978,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
                region={
                  lat && lng
                    ? {
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }
                    : undefined
                }
                pointerEvents="auto">
                {lat && lng && (
                  <Marker coordinate={{latitude: lat, longitude: lng}} />
                )}
                {lat && lng && radius && (
                  <Circle
                    center={{latitude: lat, longitude: lng}}
                    radius={radius}
                    fillColor="rgba(60,130,246,0.1)"
                    strokeColor="#3B81F5"
                  />
                )}
              </MapBox>
            </Box>

            <SelectButtonRow>
              <CancelBtn onPress={() => navigation.navigate('Home')}>
                <BtnText>취소</BtnText>
              </CancelBtn>
              <CreateBtn onPress={handleCreate}>
                <BtnTextWhite>챌린지 생성</BtnTextWhite>
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

        <Modal visible={showPlaceModal} animationType="slide">
          <ModalContainer>
            <PlaceSearchInput
              onPlaceSelected={place => {
                setAddress(place.address);
                setLat(place.lat);
                setLng(place.lng);
                setShowPlaceModal(false);
              }}
            />
            <CloseBtn onPress={() => setShowPlaceModal(false)}>
              <CloseBtnText>닫기</CloseBtnText>
            </CloseBtn>
          </ModalContainer>
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

const MapBox = styled(MapView)`
  width: 100%;
  height: 180px;
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
`;

const ModalContainer = styled.View`
  flex: 1;
  background: #fff;
  padding: 20px;
`;

const CloseBtn = styled.TouchableOpacity`
  margin-top: 16px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #e5e7eb;
`;

const CloseBtnText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export default CreateChallengePage;
