import { useStore } from 'zustand';
import { appStore } from '../stores';

export const useAppStore = () => useStore(appStore);