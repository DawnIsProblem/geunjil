import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import type { RootStackParamList } from './src/types/navigation';

import LandingPage from './src/pages/LandingPage';
import LoginPage from './src/pages/LoginPage';
import SignUpPage from './src/pages/SignUpPage';
import HomePage from './src/pages/HomePage';
import MyPage from './src/pages/MyPage';
import CreateChallengePage from './src/pages/CreateChallengePage';
import AllChallengesPage from './src/pages/AllChallengesPage';
import ChallengeEditPage from './src/pages/ChallengeEditPage';
import ChallengeProgressPage from './src/pages/ChallengeProgressPage';
import ChallengeSuccessPage from './src/pages/ChallengeSuccessPage';
import ChallengeFailPage from './src/pages/ChallengeFailPage';
import CameraWithWatermark from './src/pages/CameraWithWatermark';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  React.useEffect(() => {
    const m = getMessaging(getApp());
    const unsub = onMessage(m, async rm => {
      console.log('📩 Foreground message:', rm);
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="MyPage" component={MyPage} />
          <Stack.Screen
            name="CreateChallenge"
            component={CreateChallengePage}
          />
          <Stack.Screen name="AllChallenges" component={AllChallengesPage} />
          <Stack.Screen name="ChallengeEdit" component={ChallengeEditPage} />
          <Stack.Screen
            name="ChallengeProgress"
            component={ChallengeProgressPage}
          />
          <Stack.Screen
            name="ChallengeSuccess"
            component={ChallengeSuccessPage}
          />
          <Stack.Screen name="ChallengeFail" component={ChallengeFailPage} />
          <Stack.Screen
            name="CameraWithWatermark"
            component={CameraWithWatermark}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
