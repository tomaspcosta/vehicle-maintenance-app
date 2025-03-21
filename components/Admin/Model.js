import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native"

const AdminModel = ({ data, navigation }) => {
    const { id, brand, model} = data;
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Models Edit", { modelId: id })}>
        <View style={styles.container}>
            <Text style={[styles.column, styles.dateColumn]}>{brand}</Text>
            <Text style={[styles.column, styles.kmColumn]}>{model}</Text>
        </View>
        </TouchableOpacity>
        
    );
}

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
        marginLeft:10
      },
      kmColumn: {
        marginLeft:50,
        textAlign: "center",
      },
      dateColumn: {
        textAlign: "left",
      },
   
})

export default AdminModel
