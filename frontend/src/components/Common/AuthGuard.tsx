import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {RootStackParamList} from '../../types/navigation';
import type {StackNavigationProp} from '@react-navigation/stack';

const AuthGuard = ({children}: {children: React.ReactNode}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert(
            '로그인 필요 🥲',
            '로그인 후 이용해 주세요.',
            [
              {
                text: '확인',
                onPress: () => navigation.replace('Login'),
              },
            ],
            {cancelable: false},
          );
        }
      };
      checkAuth();
    }, [navigation]),
  );

  return <>{children}</>;
};

export default AuthGuard;
