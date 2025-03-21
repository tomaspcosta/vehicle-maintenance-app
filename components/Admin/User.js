import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native"
import profile from "../../assets/images/profile.png";

const AdminUser = ({ data, navigation }) => {
  const { id, username } = data;
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Users Management Edit", { userId: id })}>
      <View style={styles.container}>
        <Image source={{ uri: data.image }} style={styles.profileimage} />
        <Text style={styles.column}>{username}</Text>
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
    },
   
})

export default AdminUser
