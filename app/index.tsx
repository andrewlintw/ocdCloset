import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const pages: {id: string; route: Href; label: string}[] = [
  {id: "add", route: "/add", label: "加衣服"}, 
  {id: "delete", route: "/delete", label: "收衣服"}, 
  {id: "recommend", route: "/recommend", label: "推薦衣服"},
  {id: "check-weather", route: "/check-weather", label: "查看天氣"}
];

export default function Index() {
  const router = useRouter();
  const handleSwitch = (route: Href) => {
    router.navigate(route);
  };
  return (
    <View
      style={styles.container}
    >
      <Text>智慧衣架</Text>
      {pages.map((page) => (
        <Pressable
          key={page.id}
          style={styles.button}
          onPress={() => handleSwitch(page.route)}>
          <Text>{page.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    padding: 5,
    backgroundColor: '#0080ff',
  },
});