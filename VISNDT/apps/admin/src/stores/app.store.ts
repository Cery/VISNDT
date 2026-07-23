import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const appStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
}));