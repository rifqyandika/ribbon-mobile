import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import { create } from "zustand";

interface AuthState {
  token: string | null; // access_token
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await Axios.post(
        "http://192.168.31.136:8000/api/auth/login",
        { username, password }
      );

      const accessToken = response.data.data.access_token;
      const user = response.data.data.user;

      set({ token: accessToken, user, loading: false });
      await AsyncStorage.setItem("token", accessToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (err: any) {
      set({ error: err.message || "Login gagal", loading: false });
    }
  },

  logout: async () => {
    set({ token: null, user: null });
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    if (token) set({ token, user: user ? JSON.parse(user) : null });
  },
}));
