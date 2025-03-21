import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native"

const Brands = ({ data, navigation }) => {
    const { id, brand } = data;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Brands Edit", { brandId: id })}>
        <View style={styles.container}>
          <Text style={styles.column}>{brand}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E37D00',
        padding: 10,
        marginBottom: 10,
        height: 80,
        width: 340,
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft:10,
        textAlign:"center"
      },
   
})

export default Brands
