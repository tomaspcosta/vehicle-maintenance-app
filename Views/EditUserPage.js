import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "react-native-vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import profileImage from "../assets/images/profile.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getUserByIdAsync,
  getCityAsync,
  getCurrentUser,
} from "../services";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { FileSystem } from "react-native-unimodules";

export default function EditUserView({ navigation }) {
  const userId = getCurrentUser().uid;
  const isNewUser = false;
  const [userData, setUserData] = useState(null);
  const [updatedUserName, setupdatedUserName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const storage = getStorage();
  const firestore = getFirestore();

  // Dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  // Datepicker
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = () => {
      setupdatedUserName("");
      setUserData(null);
      if (!isNewUser) {
        getUserByIdAsync(userId, (data) => {
          setUserData(data);
          setupdatedUserName(data?.username || "");
        });
      }
    };

    fetchData();
  }, [userId, isNewUser]);

  useEffect(() => {
    getCityAsync((cityData) => {
      const cityOptions = cityData.map((city) => city.name);
      setOptions(cityOptions);
    });
  }, []);

  const uploadImage = async () => {
    try {
      if (imageUri) {
        const { uri } = await FileSystem.getInfoAsync(imageUri, { size: true });
        console.log("URI:", uri);
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log("Blob:", blob);
        const imageName = Date.now().toString();

        const storageRef = ref(storage, `users/${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log("Image upload error:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(storageRef);

            const userRef = doc(firestore, "Users", getCurrentUser().uid);
            await updateDoc(userRef, { image: downloadURL });

            console.log("Imagem guardada com sucesso");

            setUserData((prevUserData) => ({
              ...prevUserData,
              image: downloadURL,
            }));
          }
        );
      } else {
        console.log("Nenhuma imagem selecionada");
      }
    } catch (error) {
      console.log("Erro de upload da imagem:", error);
    }
  };

const pickImage = async () => {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão recusada",
        "De permissão para aceder a galeria."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedAsset = pickerResult.assets[0];
      if (selectedAsset) {
        setImageUri(selectedAsset.uri);
      }
    }
  } catch (error) {
    console.log("Erro image picker:", error);
  }
};


  const [imageUri, setImageUri] = useState(null);


  return (
    <View style={styles.oldContainer}>
      <ScrollView>
      <View style={styles.content}>
      <View style={{ width:100,}}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: userData?.image }} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      </View>
        <View style={styles.buttonChange}>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formTop}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Username"
                value={updatedUserName}
                onChangeText={setupdatedUserName}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Email Address"
                value={userData?.email || ""}
                
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="First Name"
                value={userData?.firstName || ""}
               
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Last Name"
                value={userData?.lastName || ""}
               
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Birthday</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={[{ width: "80%" }]}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#888"
                value={selectedDate.toLocaleDateString()}
                onFocus={toggleDatePicker}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}
              <TouchableOpacity
                style={styles.calendarButton}
                onPress={toggleDatePicker}
              >
                <FontAwesome name="calendar" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Street Name</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Street Name"
                value={userData?.streetName || ""}
              />
            </View>
          </View>

          <View style={styles.form50}>
            <View
              style={[
                styles.formContainer,
                { marginRight: 10, width: "50%" },
              ]}
            >
              <Text style={styles.label}>City</Text>
              <TouchableOpacity
                style={[styles.inputBoxContainer, { height: 30 }]}
                onPress={toggleDropdown}
              >
                {selectedOption ? (
                  <Text> {selectedOption}</Text>
                ) : (
                  <Text> Select City</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={[styles.formContainer, { flex: 1 }]}>
              <Text style={styles.label}>Zip-Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Zip-Code"
                value={userData?.zipCode || ""}
                
              />
            </View>
          </View>
          <Modal
            visible={showDropdown}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleDropdown}
          >
            <View style={styles.dropdownContainer}>
              <ScrollView>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => selectOption(option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>
          <View style={styles.form}>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry={!passwordVisible}
                  placeholder="Password"
                  value={userData?.password || ""}
                />
                <TouchableOpacity
                  style={styles.passwordButton}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <View style={{ backgroundColor: "transparent" }}>
                    <FontAwesome
                      name={passwordVisible ? "eye-slash" : "eye"}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  oldContainer: {
    flex: 1,
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: "100%",
    height: "100%",
    width: 350,
    zIndex: -1,
  },
  menu: {
    position: "absolute",
    zIndex: 0,
  },
  form: {
    flexDirection: "column",
    maxWidth: 400,
    zIndex: -1,
  },
  profileImage: {
    marginTop:'5%',
    marginLeft: "2%",
    width: 90,
    height: 90,
    borderRadius: 55,
  },
  formTop: {
    marginTop: "15%",
    zIndex: -1,
  },
  form50: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: -1,
  },
  button50: {
    marginTop: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: -1,
  },
  buttonChange: {
    marginTop: StatusBar.currentHeight - 160,
    marginLeft: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: -1,
  },

  uploadButton: {
    padding: 10,
    margin: 10,
    backgroundColor: "#E37D00",
    width: 80,
    alignItems: "center",
    zIndex: -1,
    marginTop: '5%'
  },
  buttonSave: {
    padding: 10,
    margin: 10,
    backgroundColor: "#E37D00",
    width: 100,
    alignItems: "center",
    zIndex: -1,
  },
  buttonDelete: {
    padding: 10,
    margin: 10,
    backgroundColor: "red",
    width: 100,
    alignItems: "center",
    zIndex: -1,
  },
  formContainer: {
    marginBottom: 5,
    zIndex: -1,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#E37D00",
    zIndex: -1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    zIndex: -1,
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    zIndex: -1,
  },
  buttonContainer: {
    alignItems: "center",
    zIndex: -1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 5,
    marginBottom: 5,
    zIndex: -1,
  },
  inputBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 5,
    marginBottom: 5,
    zIndex: -1,
  },
  passwordInput: {
    flex: 1,
    zIndex: -1,
  },
  passwordButton: {
    padding: 5,
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
    zIndex: -1,
  },
  backButton: {
    position: "absolute",
    top: 5,
    left: 5,
    marginTop: 60,
    zIndex: -1,
  },
  signIn: {
    color: "white",
    textAlign: "center",
    height: 70,
    zIndex: -1,
  },
  signInText: {
    textAlign: "center",
    color: "white",
    zIndex: -1,
  },
  link: {
    color: "skyblue",
    zIndex: -1,
  },
  calendarButton: {
    backgroundColor: "transparent",
    marginLeft: 35,
  },
  dropdownContainer: {
    position: "absolute",
    top: "71.5%",
    left: "1%",
    right: 0,
    width: "49%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    maxHeight:100,
    elevation: 1,
    overflow: "scroll",
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
