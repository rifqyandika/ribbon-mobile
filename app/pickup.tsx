import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PickupScreen() {
  const { order } = useLocalSearchParams();
  const parsedOrder = order ? JSON.parse(order as string) : null;
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [checked, setChecked] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  if (!parsedOrder) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Tidak ada order yang dipilih</Text>
      </View>
    );
  }

  const toggleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const allChecked =
    parsedOrder.order_details?.every((d: any) => checked.includes(d.id)) ||
    false;

  const handleDone = async () => {
    try {
      await axios.put(
        `http://192.168.31.136:8000/api/mobile/orders/${parsedOrder.id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert(
        "Success",
        "Order marked as complete.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err: any) {
      console.error("Gagal complete:", err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <Text className="text-2xl font-bold mb-4"># Pickup Order</Text>
      <View className="bg-blue-800 rounded-xl p-4 mb-4">
        <Text className="text-white text-xl font-semibold">
          Order ID: {parsedOrder.order_id}
        </Text>
        <Text className="text-white text-xl font-medium">
          Tracking: {parsedOrder.tracking}
        </Text>
        <Text className="text-white text-xl font-medium">
          Status: {parsedOrder.status}
        </Text>
        {/* <Text className="text-white text-xl">Buyer: {parsedOrder.buyer}</Text> */}
        <Text className="text-white text-xl">Picker: {user.full_name}</Text>
      </View>
      <FlatList
        data={parsedOrder.order_details}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleCheck(item.id)}
            className="flex-row items-center p-3 bg-white rounded-xl mb-3 border border-gray-300"
          >
            <View
              className={`w-6 h-6 mr-3 rounded border-2 justify-center items-center ${
                checked.includes(item.id)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              }`}
            >
              {checked.includes(item.id) && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-xl font-semibold">{item.product_name}</Text>
              <Text className="font-medium text-xl text-gray-400">
                Variant : {item.variant}
              </Text>
              <Text className="text-xl font-medium text-blue-800">
                Qty: {item.quantity}
              </Text>
            </View>
          </Pressable>
        )}
      />
      <Pressable
        disabled={!allChecked}
        onPress={handleDone}
        className={`mt-6 py-5 rounded-lg ${
          allChecked ? "bg-blue-800" : "bg-gray-400"
        }`}
      >
        <View className="flex-row justify-center items-center">
          <Ionicons
            name="checkmark-circle-sharp"
            size={24}
            color="white"
            className="mr-2"
          />
          <Text className="text-center text-xl font-bold text-white">
            DONE PICKUP
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
