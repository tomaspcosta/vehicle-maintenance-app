import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { getBrandAsync } from "../../services";
import { Icon } from "react-native-elements";
import Brand from "../../components/Admin/Brands";

export default function AdminBrandView({ navigation }) {
  const [brand, setBrand] = useState([]);

  useEffect(() => {
    let timer;
  
    const fetchBrandData = () => {
      getBrandAsync((brandData) => {
        setBrand(brandData);
      });
    };
    timer = setTimeout(fetchBrandData, 1000);
    return () => clearTimeout(timer);
  }, [brand]);
  

  return (
    <View style={styles.oldContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Brands</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Brands Edit", { brandId: 0 })}
        >
          <Icon name="add-circle-outline" color="white" size={60} />
        </TouchableOpacity>
        <FlatList
  style={styles.flatlist}
  data={brand}
  renderItem={({ item }) => (
    <Brand key={item.id} data={item} navigation={navigation} />
  )}
  keyExtractor={(item) => item.id}
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
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  addButton: {
    backgroundColor: "#E37D00",
    marginTop: 20,
    height: 80,
    marginLeft: 5,
    padding: 7,
    width: 320,
    fontSize: 20,
  },
  title: {
    marginTop: StatusBar.currentHeight + 80,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    right: "2%",
  },
  flatlist: {
    marginTop: 10,
    marginLeft: 5,
    backgroundColor: "transparent",
    flex: 1,
    height: 100,
  },
});
