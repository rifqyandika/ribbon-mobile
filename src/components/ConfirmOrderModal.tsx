import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type ConfirmOrderModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order?: {
    order_id: string;
    tracking: string;
    status: string;
    order_details?: any[]; // <-- tambahkan property array
  };
};

export default function ConfirmOrderModal({
  visible,
  onClose,
  onConfirm,
  order,
}: ConfirmOrderModalProps) {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/70">
        <View className="bg-white rounded-t-2xl">
          <View className="border-b p-5 flex-row justify-between items-center border-gray-300">
            <Text className="text-2xl font-bold text-center">
              CONFIRM ORDER
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={30} color="gray" />
            </Pressable>
          </View>
          <View className="p-5">
            {order && (
              <View className="mb-4">
                <Text className="text-2xl font-semibold">
                  Order: {order.order_id}
                </Text>
                <Text className="text-xl mt-1 font-medium">
                  Item Order : {order.order_details?.length} item
                </Text>
                <Text className="text-xl text-blue-600 uppercase italic mt-1 font-semibold">
                  {order.status}
                </Text>
                <View className="border-4 border-dotted border-red-600 mt-3 mb-2 p-3 rounded-lg">
                  <Text className="text-red-600 text-lg font-medium">
                    * Setelah PICKUP, order tidak dapat dibatalkan
                  </Text>
                  <Text className="text-red-600 text-lg font-medium">
                    * Pastikan order sudah sesuai
                  </Text>
                  <Text className="text-red-600 text-lg font-medium">
                    * Cek kembali order sebelum PICKUP DONE
                  </Text>
                  <Text className="text-red-600 text-lg font-medium">
                    * Hubungi admin jika ada kendala
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row justify-between mt-auto">
              <Pressable
                onPress={onConfirm}
                className="flex-1 bg-blue-800 py-5 rounded-lg"
              >
                <Text className="text-center text-xl font-semibold text-white">
                  PICKUP
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
