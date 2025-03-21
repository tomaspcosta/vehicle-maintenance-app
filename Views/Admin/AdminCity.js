import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { getCityAsync } from "../../services";
import { Icon } from "react-native-elements";
import City from "../../components/Admin/City";

export default function AdminCityView({ navigation }) {
  const [city, setCity] = useState([]);

  useEffect(() => {
    let timer;
    const fetchCityData = () => {
      getCityAsync((cityData) => {
        setCity(cityData);
      });
    };
    timer = setTimeout(fetchCityData, 1000);
    return () => clearTimeout(timer);
  }, [city]);
  
  return (
    <View style={styles.oldContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Cities</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Cities Edit", { cityId: 0 })}
        >
          <Icon name="add-circle-outline" color="white" size={60} />
        </TouchableOpacity>
        <FlatList
          style={styles.flatlist}
          data={city}
          renderItem={({ item }) => (
            <City data={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.name}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  oldContainer: {
    flex: 1,
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    zIndex: -1,
    width: "90%",
  },
  flatlist: {
    marginTop: 10,
    marginLeft: 5,
    backgroundColor: "transparent",
    flex: 1,
    height: 100,
    zIndex: -1,
  },
  addButton: {
    backgroundColor: "#E37D00",
    marginTop: 20,
    height: 80,
    marginLeft: 5,
    padding: 7,
    width: 320,
    fontSize: 20,
    zIndex: -1,
  },
  title: {
    marginTop: StatusBar.currentHeight + 80,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    right: "2%",
    zIndex: -1,
  },
});
