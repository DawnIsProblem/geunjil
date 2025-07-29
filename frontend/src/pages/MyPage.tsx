import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMypageInfo, getMypageRecent3} from '../api/mypageApi';
import RecentChallengeCard from '../components/MyPage/RecentChallengeCard';
import Icon from 'react-native-vector-icons/Ionicons';
import HeadeMyPage from '../components/MyPage/HeaderMyPage';
import Footer from '../components/Common/Footer';
import PieCharts from '../components/MyPage/PieCharts';
import {logoutApi} from '../api/logoutApi';
import {deleteAccountApi} from '../api/deleteAccountApi';
import {Alert} from 'react-native';
import {useUserStore} from '../store/userStore';
import AuthGuard from '../components/Common/AuthGuard';

const MyPage = ({navigation}: any) => {
  const {logout} = useUserStore();
  const [info, setInfo] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMypageData = async () => {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        // 인증 체크는 AuthGuard에서 이미 했지만 혹시 모를 예외처리
        setLoading(false);
        setInfo(null);
        setRecent([]);
        return;
      }
      try {
        const infoRes = await getMypageInfo(accessToken); // 이제 string만 전달됨!
        const recentRes = await getMypageRecent3(accessToken);
        setInfo(infoRes.data);
        setRecent(recentRes.data);
      } catch (e) {
        // 에러 처리 (예: Alert로 알려주거나, 별도 에러 상태 저장)
        Alert.alert('마이페이지 정보 조회 실패', '다시 시도해 주세요.');
        setInfo(null);
        setRecent([]);
      }
      setLoading(false);
    };
    fetchMypageData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Name>로딩중...</Name>
      </Container>
    );
  }

  const handleLogout = async () => {
    try {
      await logoutApi();
      await AsyncStorage.removeItem('accessToken');
      logout(); // <<<<<< 반드시 추가!
      navigation.replace('Landing');
    } catch (e) {
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      '정말 탈퇴하시겠습니까?',
      '회원 탈퇴 시 모든 데이터가 삭제됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            try {
              const accessToken = await AsyncStorage.getItem('accessToken');
              if (!accessToken) {
                Alert.alert('로그인 정보 없음');
                return;
              }
              await deleteAccountApi(accessToken);
              await AsyncStorage.removeItem('accessToken');
              // TODO: zustand 스토어 등 사용자 상태도 초기화 필요하면 추가
              navigation.replace('Login');
            } catch (e) {
              Alert.alert('회원 탈퇴 실패', '다시 시도해주세요.');
            }
          },
        },
      ],
    );
  };

  return (
    <AuthGuard>
      <Container>
        <HeadeMyPage />

        <Content>
          <ContentInner>
            <ProfileCard>
              <Profile source={require('../assets/signature_icon.png')} />
              <Name>{info?.nickname ?? '-'}</Name>
              <Email>{info?.email ?? '-'}</Email>
              <EditBtn>
                <EditText>프로필 수정</EditText>
              </EditBtn>
            </ProfileCard>

            <StatsGrid>
              <StatBox>
                <StatNumber color="#3C82F6">
                  {info?.totalChallenge ?? 0}
                </StatNumber>
                <StatLabel>총 챌린지</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber color="#17A34A">
                  {info?.successChallenge ?? 0}
                </StatNumber>
                <StatLabel>성공</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber color="#CA8A03">
                  {info?.stopedChallenge ?? 0}
                </StatNumber>
                <StatLabel>중단</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber color="#DC2625">
                  {info?.failChallenge ?? 0}
                </StatNumber>
                <StatLabel>실패</StatLabel>
              </StatBox>
            </StatsGrid>

            <Box>
              <SectionTitle>성취도</SectionTitle>
              <PieCharts
                success={info?.successChallenge ?? 0}
                stoped={info?.stopedChallenge ?? 0}
                fail={info?.failChallenge ?? 0}
              />
            </Box>

            <OuterBox>
              <SectionTitle>최근 챌린지</SectionTitle>
              <InnerBox>
                {recent.length === 0 ? (
                  <Name>최근 챌린지 없음</Name>
                ) : (
                  recent.map((c, idx) => (
                    <RecentChallengeCard
                      key={idx}
                      title={c.title}
                      date={c.day}
                      status={c.status}
                    />
                  ))
                )}
              </InnerBox>
            </OuterBox>

            <SettingContainer>
              <SettingBtn onPress={handleLogout}>
                <Icon name="log-out-outline" size={20} color="#000000" />
                <SettingText>로그아웃</SettingText>
              </SettingBtn>
              <DangerBtn onPress={handleDeleteAccount}>
                <Icon name="alert-circle-outline" size={20} color="#DC2625" />
                <DangerText>회원 탈퇴</DangerText>
              </DangerBtn>
            </SettingContainer>
          </ContentInner>
        </Content>

        <Footer />
      </Container>
    </AuthGuard>
  );
};

const Container = styled.View`
  flex: 1;
  background: #f8fafc;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const ContentInner = styled.View`
  padding: 20px;
  flex-grow: 1;
`;

const ProfileCard = styled.View`
  background: white;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-bottom: 16px;
  border: 1px solid #e4e4e7;
`;

const Profile = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 16px;
`;

const Name = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const Email = styled.Text`
  font-size: 12px;
  color: #555;
  margin: 4px 0;
`;

const EditBtn = styled.TouchableOpacity`
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 8px;
`;

const EditText = styled.Text`
  font-size: 13px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatBox = styled.View`
  background: white;
  width: 48%;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  align-items: center;
  border: 1px solid #e4e4e7;
`;

const StatNumber = styled.Text<{color: string}>`
  font-size: 32px;
  font-weight: bold;
  color: ${({color}) => color};
`;

const StatLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #4b5563;
  margin-top: 4px;
`;

const Box = styled.View`
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e4e4e7;
`;

const OuterBox = styled(Box)`
  border: 1px solid #e4e4e7;
  background: #ffffff;
`;

const InnerBox = styled.View`
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SettingContainer = styled(Box)``;

const SettingBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  justify-content: left;
`;

const SettingText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
`;

const DangerBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  justify-content: left;
`;

const DangerText = styled.Text`
  color: #dc2625;
  font-size: 14px;
  margin-left: 8px;
  font-weight: bold;
`;

export default MyPage;
