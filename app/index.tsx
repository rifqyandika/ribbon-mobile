import HeaderComponent from "@/src/components/HeaderComponents";
import InfoComponents from "@/src/components/InfoComponents";
import OrderListComponent from "@/src/components/OrderListComponents";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainActivity() {
  const router = useRouter();

  const handleScanPress = () => {
    // router.push("/scanner");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <HeaderComponent />
      <InfoComponents />
      <View className="mt-[-10px] flex-1 rounded-t-3xl px-6 pt-4">
        <Text className="text-lg font-bold mb-1 mt-4">Order List</Text>
        <OrderListComponent />
      </View>
      <View className="bg-white p-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleScanPress}
          className="bg-blue-700 flex-row items-center justify-center p-5 rounded-xl"
        >
          <Ionicons name="scan-outline" size={26} color="white" />
          <Text className="text-white font-semibold text-xl ml-2">
            Scan Barcode
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
