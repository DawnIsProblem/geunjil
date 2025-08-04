import { create, StateCreator } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMainPageInfo } from '../api/mainpageApi';

export interface CurrentChallenge {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  progressPercent: number;
}

export interface NextChallenge {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Result {
  success: number;
  stoped: number;
  fail: number;
}

export interface MainInfoData {
  currentChallenge: CurrentChallenge | null;
  nextChallenge: NextChallenge | null;
  result: Result;
}

interface MainInfoStore {
  mainInfo: MainInfoData | null;
  fetchMainInfo: () => Promise<void>;
}

const createMainInfoStore: StateCreator<MainInfoStore> = set => ({
  mainInfo: null,

  fetchMainInfo: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        set({ mainInfo: null });
        return;
      }
      const res = await getMainPageInfo(token);
      const dto: MainInfoData = res.data;
      set({ mainInfo: dto });
    } catch (err) {
      console.warn('메인페이지 정보 조회 실패', err);
    }
  },
});

export const useMainInfoStore = create<MainInfoStore>(createMainInfoStore);
