import ScannerComponent from "@/src/components/ScannerComponent";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScannerScreenWrapper() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScannerComponent />
    </SafeAreaView>
  );
}
