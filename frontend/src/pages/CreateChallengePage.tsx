import React, {useState} from 'react';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderCreate from '../components/CreateChallengePage/HeaderCreate';
import LocationInput from '../components/CreateChallengePage/LocationInput';
import Footer from '../components/Common/Footer';
import {Modal} from 'react-native';
import WebView from 'react-native-webview';
import type {NativeSyntheticEvent} from 'react-native';
type WebViewMessageEvent = NativeSyntheticEvent<{data: string}>;
import AuthGuard from '../components/Common/AuthGuard';

const CreateChallengePage = () => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  const [date, setDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [address, setAddress] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

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
              <Input placeholder="예: 500" keyboardType="numeric" />
              <LocationInput />
            </Box>

            <SelectButtonRow>
              <CancelBtn>
                <BtnText>취소</BtnText>
              </CancelBtn>
              <CreateBtn>
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

export default CreateChallengePage;
