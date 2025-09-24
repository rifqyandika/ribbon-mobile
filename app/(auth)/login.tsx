import { useAuthStore } from "@/src/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, token, loading, error } = useAuthStore();

  const handleLogin = async () => {
    await login(username, password);
  };

  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token]);

  return (
    <LinearGradient
      colors={["#1e40af", "#1e3a8a"]}
      className="flex-1 justify-between px-6"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-between"
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-4xl font-extrabold text-white text-center">
            LivoPicker.
          </Text>
        </View>
        {error && (
            <Text className="text-red-300 text-center mb-4">{error}</Text>
          )}
        <View className="mb-5">
          <TextInput
            className="text-lg w-full bg-white/20 text-white rounded-xl px-4 py-5 mb-4"
            placeholder="Username"
            placeholderTextColor="#ddd"
            value={username}
            onChangeText={setUsername}
            cursorColor={"white"}
          />
          <TextInput
            className="text-lg w-full bg-white/20 text-white rounded-xl px-4 py-5 mb-4"
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            cursorColor={"white"}
          />
          <TouchableOpacity
            onPress={handleLogin}
            className={`w-full py-5 rounded-xl flex-row justify-center items-center ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center font-semibold text-2xl">
                Login
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View className="items-center mb-6">
        <Text className="text-white/70 text-lg">Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
}
