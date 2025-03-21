import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native"
import profile from "../assets/images/profile.png";
import { shareCarWithUser, getCurrentUser } from "../services";

const Users = ({ data, navigation, carId }) => {
  const { id, username, image } = data;
  const currentUserUuid = getCurrentUser()?.uid;

  const handlePress = () => {
    shareCarWithUser(carId, id);
  };
  
  if (id === currentUserUuid) {
    return null;
  }
 
  return (
    <TouchableOpacity onPress={handlePress}>
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
        width: 180,
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft:30
      },
    carimage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        overflow: 'hidden',
      },
    profileimage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        overflow: 'hidden',
        paddingLeft:5,
    },
   
})

export default Users
