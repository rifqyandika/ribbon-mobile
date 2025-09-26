import { useAuthStore } from "@/src/store/authStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function InfoComponents() {
  const token = useAuthStore((state) => state.token);
  const [total, setTotal] = useState(0);

useEffect(() => {
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "http://192.168.31.136:8000/api/mobile/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("Orders:", res.data.data.orders);
      const total = res.data.data.pagination.total;
      setTotal(total);
    } catch (err: any) {
      console.error("Gagal fetch orders:", err.response?.data || err.message);
    }
  };
  fetchOrders();
}, [token]);

  return (
    <View className="flex-row justify-between mx-4 -mt-24 z-10">
      <View className="bg-white flex-1 h-32 px-6 py-4 rounded-xl shadow-lg mr-2">
        <Text className="text-black text-base font-medium">Total Order</Text>
        <Text className="text-black text-3xl font-bold mt-2">{total}</Text>
        <Text className="text-black text-sm mt-1">Semua pesanan</Text>
      </View>
      <View className="bg-white flex-1 h-32 px-6 py-4 rounded-xl shadow-lg ml-2">
        <Text className="text-blue-600 text-base font-medium">
          Order Selesai
        </Text>
        <Text className="text-blue-600 text-3xl font-bold mt-2">0</Text>
        <Text className="text-blue-600 text-sm mt-1">Sudah diproses</Text>
      </View>
    </View>
  );
}
