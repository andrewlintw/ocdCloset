/*import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CheckWeather() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Weather</Text>
      <Text>這裡可以放天氣 API、輸入城市、或目前位置天氣...</Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>回主頁</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 16 },
  button: { marginTop: 16, padding: 10, backgroundColor: "#0080ff" },
  buttonText: { color: "#fff" },
});*/
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function CheckWeather() {
  const router = useRouter();
  const [city, setCity] = useState(""); // 使用者輸入的城市
  const [weather, setWeather] = useState(null); // 天氣資訊
  const [loading, setLoading] = useState(false);

  const API_KEY = "CWA-CE706F0D-7909-40BD-8247-40167420CF73"; // 換成你自己的中央氣象局 API key

  const fetchWeather = async () => {
    if (!city) {
      Alert.alert("請輸入城市名稱");
      return;
    }
    setLoading(true);
    setWeather(null);
    try {
      const response = await fetch(
        `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${encodeURIComponent(city)}`
      );
      const data = await response.json();
      // 簡單解析第一個地點的天氣狀況
      const location = data.records.location[0];
      const weatherText = location.weatherElement[0].time[0].parameter.parameterName;
      setWeather(weatherText);
    } catch (error) {
      console.error(error);
      Alert.alert("取得天氣失敗", "請確認 API KEY 與城市名稱正確");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Weather</Text>

      <TextInput
        style={styles.input}
        placeholder="輸入台灣城市 (例如: 台北市)"
        value={city}
        onChangeText={setCity}
      />

      <Pressable style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>查詢天氣</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#0080ff" style={{ marginTop: 16 }} />}

      {weather && (
        <Text style={styles.weatherText}>
          {city} 今日天氣：{weather}
        </Text>
      )}

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>回主頁</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, width: "100%", marginBottom: 12 },
  button: { marginTop: 16, padding: 10, backgroundColor: "#0080ff", borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
  weatherText: { fontSize: 18, marginTop: 16 }
});