import { useAuthStore } from "@/src/store/authStore";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

export default function RootLayout() {
  const loadToken = useAuthStore((state) => state.loadToken);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const pathname = usePathname();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadToken(); 
      setIsReady(true);  
    };
    init();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!token && pathname !== "/(auth)/login") {
      router.replace("/(auth)/login");
    } else if (token && pathname === "/(auth)/login") {
      router.replace("/");
    }
  }, [token, pathname, isReady]);
return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
    </Stack>
  );
}
