import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native"

const Model = ({ props, navigation }) => {
    const { brand, model} = props.data;
    return (
        <TouchableOpacity onPress={() => console.log('FlatList pressed!')}>
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

export default Model
