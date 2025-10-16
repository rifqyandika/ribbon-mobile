import { useAuthStore } from "@/src/store/authStore";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const boxSize = 250;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) return <Text>Memeriksa izin kamera...</Text>;
  if (!permission.granted) return <Text>Izinkan kamera di pengaturan.</Text>;

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, boxSize - 4],
  });

  return (
    <View className="flex-1 bg-black rounded-lg overflow-hidden">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={async ({ data }) => {
          if (scanned) return;
          setScanned(true);

          try {
            if (!token) {
              Alert.alert(
                "Error",
                "Token tidak ditemukan. Silakan login ulang."
              );
              return;
            }

            // Try to fetch orders and find matching tracking
            const res = await axios.get(
              "http://192.168.31.136:8000/api/mobile/orders",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const orders = res.data.data.orders as any[];
            const matched = orders.find((o) => o.tracking === data);

            if (!matched) {
              Alert.alert(
                "Tidak ditemukan",
                `Order resi ${data} tidak ditemukan.`
              );
              setScanned(false);
              return;
            }

            // Call pick endpoint similar to ConfirmOrderModal flow
            try {
              const pickRes = await axios.put(
                `http://192.168.31.136:8000/api/mobile/orders/${matched.id}/pick`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const pickedOrder = pickRes.data.data;
              router.push({
                pathname: "/pickup",
                params: { order: JSON.stringify(pickedOrder) },
              });
            } catch (err: any) {
              if (err.response?.status === 404) {
                Alert.alert("Gagal", "Order sudah di pick oleh picker lain.");
              } else {
                console.error(
                  "Gagal pickup via scanner:",
                  err.response?.data || err.message
                );
                Alert.alert(
                  "Error",
                  "Terjadi kesalahan saat pickup order via scanner."
                );
              }
              setScanned(false);
            }
          } catch (err: any) {
            console.error(
              "Gagal mencari order:",
              err.response?.data || err.message
            );
            Alert.alert("Error", "Gagal mencari order. Coba lagi.");
            setScanned(false);
          }
        }}
      />
      <View className="flex-1 justify-center items-center">
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        />
        <View
          style={{
            width: boxSize,
            height: boxSize,
            position: "relative",
          }}
          className="rounded-lg overflow-hidden"
        >
          <View className="absolute top-0 left-0 w-10 h-1 bg-green-400" />
          <View className="absolute top-0 left-0 w-1 h-10 bg-green-400" />

          <View className="absolute top-0 right-0 w-10 h-1 bg-green-400" />
          <View className="absolute top-0 right-0 w-1 h-10 bg-green-400" />

          <View className="absolute bottom-0 left-0 w-10 h-1 bg-green-400" />
          <View className="absolute bottom-0 left-0 w-1 h-10 bg-green-400" />

          <View className="absolute bottom-0 right-0 w-10 h-1 bg-green-400" />
          <View className="absolute bottom-0 right-0 w-1 h-10 bg-green-400" />
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: 2,
              backgroundColor: "red",
              transform: [{ translateY }],
            }}
          />
        </View>
        <Text className="text-white text-center text-xs font-semibold mt-6">
          Arahkan barcode ke dalam kotak
        </Text>
      </View>
    </View>
  );
}
