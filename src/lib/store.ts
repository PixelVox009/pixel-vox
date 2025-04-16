import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { userService } from "./api/user";

// Định nghĩa interface cho state
interface TokenState {
  tokenBalance: number;
  setTokenBalance: (balance: number) => void;
  addTokens: (amount: number) => void;
  subtractTokens: (amount: number) => void;
}

export const useTokenStore = create<TokenState>()(
  devtools((set) => ({
    tokenBalance: 0,
    setTokenBalance: (balance) => set({ tokenBalance: balance }),
    addTokens: (amount) =>
      set((state) => ({ tokenBalance: state.tokenBalance + amount })),
    subtractTokens: async (amount) => {
      const res = await userService.useToken(amount);

      if (res.statusCode === 200) {
        set((state) => ({ tokenBalance: state.tokenBalance - amount }));
      }
    },
  }))
);

// Store cho các tùy chọn giao diện
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Store cho các cài đặt của người dùng
interface UserSettingsState {
  generatorSettings: {
    defaultVoice: string;
    defaultImageStyle: string;
    defaultVideoStyle: string;
  };
  updateGeneratorSettings: (
    settings: Partial<UserSettingsState["generatorSettings"]>
  ) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      generatorSettings: {
        defaultVoice: "female_1",
        defaultImageStyle: "realistic",
        defaultVideoStyle: "cinematic",
      },
      updateGeneratorSettings: (settings) =>
        set((state) => ({
          generatorSettings: {
            ...state.generatorSettings,
            ...settings,
          },
        })),
    }),
    {
      name: "user-settings",
    }
  )
);
