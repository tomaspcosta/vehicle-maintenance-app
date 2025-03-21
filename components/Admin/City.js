import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native"

const Cities = ({ data, navigation }) => {
    const { id, name } = data;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Cities Edit", { cityId: id })}>
        <View style={styles.container}>
          <Text style={styles.column}>{name}</Text>
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

export default Cities
