import { useEffect, useState } from "react";
import {View,Text,Button,Image,StyleSheet,TouchableWithoutFeedback,TextInput,TouchableOpacity, FlatList, StatusBar, ScrollView,} from "react-native";
import {getModelAsync} from "../../services";
import { Icon } from "react-native-elements";
import AdminModel from "../../components/Admin/Model";
import Menu from "../../components/SideBarMenu";

export default function AdminModelsView({ navigation}) {
  const [model, setModel] = useState([]);

  useEffect(() => {
    let timer;
  
    const fetchModelData = () => {
      getModelAsync((modelData) => {
        setModel(modelData);
      });
    };
    timer = setTimeout(fetchModelData, 1000);
    return () => clearTimeout(timer);
  }, [model]);
  

  return (
    <View style={styles.oldContainer}>
    <View style={styles.container}>

       <Text style={styles.title}>
        Models
        </Text>
    <Text style={styles.subtitle}>
        {`${"Brand".padStart(5)}${"".padStart(25)}${"Model".padStart(15)}`}{"\n"}
    </Text>

    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Models Edit", { modelId: 0 })}>
      <Icon name="add-circle-outline" color="white" size={60}/>
    </TouchableOpacity>
    
    <FlatList
        style={styles.flatlist}
        data={model}
        renderItem={({ item }) => <AdminModel data={item} navigation={navigation}/>}
        keyExtractor={(model) => model.id.toString()}
      />
    </View>
    </View>
  );
}
// 
const styles = StyleSheet.create({
  oldContainer: {
    flex: 1,
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    zIndex:-1,
    width:"90%",
  },
  menu: {
    position: "absolute",
    zIndex: 0,
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
    height:80,
    marginLeft: 5,
    padding: 7,
    width: 320,
    fontSize:20,
    zIndex:-1,
},
title:{
  marginTop: StatusBar.currentHeight + 80,
  fontSize: 30,
  fontWeight: 'bold',
  color:'white',
  right:"2%",
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
