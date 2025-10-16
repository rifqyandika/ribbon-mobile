import ConfirmOrderModal from "@/src/components/ConfirmOrderModal";
import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function OrdersScreen() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          "http://192.168.31.136:8000/api/mobile/orders",
          {
            headers : { Authorization: `Bearer ${token}` },
          }
        );
        // console.log("Orders:", res.data.data.orders);
        setOrders(res.data.data.orders);
      } catch (err: any) {
        console.error("Gagal fetch orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
  if (!selectedOrder) return;

  try {
    const res = await axios.put(
      `http://192.168.31.136:8000/api/mobile/orders/${selectedOrder.id}/pick`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedOrder = res.data.data;
    router.push({
      pathname: "/pickup",
      params: { order: JSON.stringify(updatedOrder) },
    });
  } catch (err: any) {
    if (err.response?.status === 404) {
      Alert.alert(
        "Gagal",
        "Order sudah di pick oleh picker lain.",
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
    } else {
      console.error("Gagal pickup order:", err.response?.data || err.message);
      Alert.alert("Error", "Terjadi kesalahan saat pickup order.");
    }
  } finally {
    setModalVisible(false);
    setSelectedOrder(null);
  }
};
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  return (
    <View className="flex-1 mt-2">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => openModal(item)}>
            <View className="flex-row justify-between items-center p-4 mb-4 bg-white rounded-xl border border-gray-300">
              <View className="flex-row items-center">
                <Ionicons name="bag-check" size={30} color="black" />
                <View className="ml-4">
                  <Text className="text-xl font-semibold">{item.tracking}</Text>
                  {/* <Text className="text-gray-600 text-lg font-medium">{item.buyer}</Text> */}
                  <Text className="text-blue-600 italic text-md font-medium uppercase">
                    {item.status}
                  </Text>
                </View>
              </View>
              <Ionicons name="ellipsis-vertical" size={20} />
            </View>
          </Pressable>
        )}
      />
      {/* Modal Konfirmasi */}
      <ConfirmOrderModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
