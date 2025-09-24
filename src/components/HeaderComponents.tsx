import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <LinearGradient
      colors={["#1e3a8a", "#1e40af", "#1e3a8a"]} // biru gelap → biru menengah → biru terang
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 py-4 h-[210px] rounded-b-3xl"
    >
      <View className="flex-row justify-between items-center">
        {/* User Info */}
        <View className="space-y-1 py-5">
          <Text className="text-white text-2xl font-bold mb-1">
            {user?.full_name ? `Halo, ${user.full_name}!` : "Halo, Guest!"}
          </Text>
          <Text className="text-blue-100 text-2xl italic">
            {user?.roles?.[0]?.name || "Picker"}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <View className="w-16 h-16 rounded flex-col justify-center items-center">
            <Ionicons name="log-out-outline" color="#fff" size={35} />
            <Text className="text-white text-sm">Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
