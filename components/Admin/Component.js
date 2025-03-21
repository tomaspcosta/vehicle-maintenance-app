import { View, Text, StyleSheet , TouchableOpacity} from "react-native"

const AdminComponent = ({ data, navigation }) => {
    const { id, name, periodicity} = data;

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Components Edit", { componentId: id })}>
        <View style={styles.container}>
            <Text style={[styles.column, styles.dateColumn]}>{name}</Text>
            <Text style={[styles.column, styles.kmColumn]}>{periodicity}</Text>
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
        marginLeft:10,
        textAlign: "center",
      },
      dateColumn: {
        textAlign: "left",
      },
   
})

export default AdminComponent
