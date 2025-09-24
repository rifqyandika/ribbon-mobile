import HeaderComponent from "@/src/components/HeaderComponents";
import ScannerComponent from "@/src/components/ScannerComponent";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 ">
      <HeaderComponent />
      <View className="mt-[-90px] bg-gray-100 flex-1 rounded-t-3xl p-6">
        {/* <OrderListComponents /> */}
        <ScannerComponent/>
      </View>
    </SafeAreaView>
  );
}
