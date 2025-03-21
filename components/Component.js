import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";


const Component = ({ data, navigation, time, carId, carKm, carImage }) => {
  if (!data || typeof data.component === "undefined") {
    return null;
  }

  const { id, date, component, km } = data;
  const today = new Date();
  const [month, day, year] = date.split("/");
  const formattedDate = `${year}-${month}-${day}`;
  const maintenanceDate = new Date(formattedDate);

  if (time === 1 && maintenanceDate < today) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("AddNewMaintenancePage", { managId: id,carId: carId ,carKm:carKm, carImage:carImage })}>
        <View style={styles.container}>
          <Text style={[styles.column, styles.dateColumn]}>{date}</Text>
          <Text style={[styles.column, styles.componentColumn]}>{component}</Text>
          <Text style={[styles.column, styles.kmColumn]}>{km.toString()}</Text>
        </View>
      </TouchableOpacity>
    );
  } else if (time === 0 && maintenanceDate >= today) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("AddNewMaintenancePage", { managId: id,carId: carId ,carKm:carKm, carImage:carImage })}>
        <View style={styles.container}>
          <Text style={[styles.column, styles.dateColumn]}>{date}</Text>
          <Text style={[styles.column, styles.componentColumn]}>{component}</Text>
          <Text style={[styles.column, styles.kmColumn]}>{km.toString()}</Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};




const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E37D00',
        padding: 10,
        marginBottom: 10,
        width: 340,
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft:10
      },
      kmColumn: {
        marginLeft:-20,
        textAlign: "right",
      },
      componentColumn: {
        marginLeft:30,
        textAlign: "left",
      },
      dateColumn: {
        textAlign: "left",
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
    },
   
})

export default Component
