import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HeaderComponent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View className="bg-blue-800 h-52 mb-6 px-6 pt-3 flex-row justify-between items-start z-10">
      <View className="flex-row items-center pt-6">
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://i.pravatar.cc/150?img=50",
          }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-white text-2xl font-bold mb-1">
            {user?.full_name ? `${user.full_name}!` : "Guest!"}
          </Text>
          <Text className="text-blue-100 font-medium text-xl italic">
            {user?.roles?.[0]?.name || "Picker"}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} className="pt-6">
        <View className="w-16 h-16 rounded-full justify-center items-center">
          <Ionicons name="log-out-outline" color="#fff" size={35} />
          <Text className="text-white text-sm">Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
