import { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import carimage from "../assets/images/car.png";
import profile from "../assets/images/profile2.png";

const Car = ({ data, navigation, isSharedCar, getUserImage }) => {
  const { id, plate, isShared, userId, image } = data;

  useEffect(() => {
    getUserImage(userId);
  }, [userId, getUserImage]);

  const handleCarPress = () => {
    const carId = id;
    const routeParams = {
      carId: carId,
      isSharedCar: isSharedCar || isShared,
      userId: userId,
    };
    navigation.navigate('CarPage', routeParams);
  };

  console.log(image);
  console.log(data);
  return (
    <TouchableOpacity onPress={handleCarPress}>
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.carimage} />
        <Text style={styles.title}>{plate}</Text>
        {isShared && <Image source={{ uri: getUserImage(userId) }} style={styles.profileimage} />}
      </View>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E37D00',
        padding: 10,
        marginBottom: 10,
        width: 350,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft:10
    },
    carimage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        overflow: 'hidden',
        marginRight:'20%'
      },
    profileimage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        overflow: 'hidden',
        paddingLeft:5,
        marginLeft:'15%',
    }
})

export default Car
