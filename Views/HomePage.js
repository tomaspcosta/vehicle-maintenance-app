import { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableWithoutFeedback, TextInput, TouchableOpacity, FlatList, StatusBar, ScrollView } from "react-native";
import { getCarAsync, getSharedCarAsync } from "../services";
import Car from "../components/Car";
import { Icon } from "react-native-elements";
import { getUserByIdAsync } from "../services";

export default function HomePageView({ navigation }) {
  const [cars, setCars] = useState([]);
  const [showSharedCars, setShowSharedCars] = useState(false);
  const [userImages, setUserImages] = useState({});

  const fetchData = () => {
    if (showSharedCars) {
      getSharedCarAsync((data) => {
        const sharedCars = data.map((car) => ({ ...car, isShared: true }));
        setCars(sharedCars);
      });
    } else {
      getCarAsync((data) => {
        setCars(data);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [showSharedCars]);

  const filteredCars = showSharedCars ? cars.filter((car) => car.isShared) : cars;

  const getUserImage = (userId) => {
    return userImages[userId] || null;
  };

  const fetchUserImage = (userId) => {
    getUserByIdAsync(userId, (user) => {
      setUserImages((prevUserImages) => ({
        ...prevUserImages,
        [userId]: user.image,
      }));
    });
  };

  useEffect(() => {
    cars.forEach((car) => {
      fetchUserImage(car.userId);
    });
  }, [cars]);

  return (
    <View style={styles.oldContainer}>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, !showSharedCars ? { opacity: 0.4 } : null]}
            onPress={() => setShowSharedCars(false)}
          >
            <Text style={styles.buttonText}>My Cars</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, showSharedCars ? { opacity: 0.4 } : null]}
            onPress={() => setShowSharedCars(true)}
          >
            <Text style={styles.buttonText}>Shared Cars</Text>
          </TouchableOpacity>
        </View>
        {!showSharedCars && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CarPage', { carId: 0 })}
          >
            <Icon name="add-circle-outline" color="white" size={50} />
          </TouchableOpacity>
        )}
        {filteredCars.length > 0 ? (
          <FlatList
            style={styles.flatlist}
            data={filteredCars}
            renderItem={({ item }) => (
              <Car
                data={item}
                navigation={navigation}
                isSharedCar={showSharedCars}
                getUserImage={getUserImage}
              />
            )}
            keyExtractor={(car) => car.id.toString()}
          />
        ) : (
          <Text style={styles.title2}>{showSharedCars ? 'No shared cars' : 'No cars'}</Text>
        )}
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  oldContainer:{
      flex: 1,
      backgroundColor: "#142F36",
      alignItems: "center",
      justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    zIndex:-1,
    backgroundColor: "#142F36",
  },
  menu: {
    position: "absolute",
    zIndex: 0,
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex:-1,
  },
  flatlist: {
    marginTop: 10,
    marginLeft: 5,
    backgroundColor:'transparent',
    flex:1,
    height: 100,
    zIndex:-1,
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: "transparent",
    width: 150,
    alignItems: "center",
    zIndex:-1,
  },
  buttonText: {
    fontSize: 20,
    color: "#E37D00",
    textAlign: "center",
    zIndex:-1,
  },
  addButton: {
    backgroundColor: '#E37D00',
    height:65,
    marginLeft: 5,
    padding: 7,
    width: 350,
    fontSize:20,
    zIndex:-1,
},
title:{
  marginTop: StatusBar.currentHeight || 0,
  marginLeft: '20%',
  fontSize: 20,
  color:'#E37D00',
  zIndex:-1,
},
title2:{
  marginTop: StatusBar.currentHeight || 0,
  
  fontSize: 20,
  color:'#E37D00',
  zIndex:-1,
}
});
