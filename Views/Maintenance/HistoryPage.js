import { useEffect, useState } from "react";
import {View,Text,Button,Image,StyleSheet,TouchableWithoutFeedback,TextInput,TouchableOpacity, FlatList, StatusBar, ScrollView,} from "react-native";
import { getHistoryAsync } from "../../services";
import Component from "../../components/Component";
import carimage from "../../assets/images/car.png";
import { Icon } from "react-native-elements";
import Menu from "../../components/SideBarMenu.js";

export default function HistoryPageView({ navigation, route }) {

  const { carId, carKm, carImage  } = route.params;

  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchHistory = () => {
      getHistoryAsync(carId, (data) => {
        setHistory(data);
      });
    };
    fetchHistory();
    const timer = setInterval(fetchHistory, 1000);
    return () => clearInterval(timer);
  }, [carId]);
  
  
 

  return (
    <View style={styles.oldContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Maintenances History! </Text>
      <Image source={{ uri: carImage }} style={styles.carimage} />
      
    <Text style={styles.subtitle}>
        {`${"Date".padStart(5)}${"Component".padStart(25)}${"Km".padStart(15)}`}{"\n"}
    </Text>

    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddNewMaintenancePage", { managId: 0 ,carId: carId, carKm: carKm, carImage: carImage} )}>
      <Icon name="add-circle-outline" color="white" size={25}/>
    </TouchableOpacity>
    
    <FlatList
  style={styles.flatlist}
  data={history.sort((a, b) => b.km - a.km)}
  renderItem={({ item }) => <Component data={item} time={1} carId={carId} carKm={carKm} carImage={carImage} navigation={navigation}/>}
  keyExtractor={(item) => item.id.toString()}
/>




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
    alignItems: 'center',
    zIndex:-1,
  },
  menu: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  buttons: {
    marginTop: 100,
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
    height:40,
    marginLeft: 5,
    padding: 7,
    width: 340,
    fontSize:20,
    zIndex:-1,
},
title:{
    marginTop: StatusBar.currentHeight + 50,
    marginLeft: '35%',
    fontSize: 20,
    color:'#E37D00',
    zIndex:-1,
  },
  carimage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight:'65%',
    marginTop:'-15%',
    zIndex:-1,
  },
  subtitle:{
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft:10,
    color:'#E37D00',
    zIndex:-1,
  }
});
