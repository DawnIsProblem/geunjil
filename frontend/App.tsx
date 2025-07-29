import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './src/types/navigation';
import {SafeAreaView} from 'react-native-safe-area-context';

import LandingPage from './src/pages/LandingPage';
import LoginPage from './src/pages/LoginPage';
import SignUpPage from './src/pages/SignUpPage';
import HomePage from './src/pages/HomePage';
import MyPage from './src/pages/MyPage';
import CreateChallengePage from './src/pages/CreateChallengePage';
import AllChallengesPage from './src/pages/AllChallengesPage';
import ChallengeEditPage from './src/pages/ChallengeEditPage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000000'}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{headerShown: false}}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
