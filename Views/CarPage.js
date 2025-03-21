import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import carimage from "../assets/images/car.png";
import Menu from "../components/SideBarMenu";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getCarById,
  updateCarData,
  getBrandAsync,
  getModelAsync,
  handleDeleteCar,
  deleteSharedCarAsync,
  getUserAsync,
} from "../services";
import Icon from "react-native-vector-icons/MaterialIcons";
import User from "../components/User";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { uploadBytesResumable } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";


export default function CarPage({ navigation, route }) {
  const { carId, isSharedCar } = route.params;
  const isNewCar = carId === 0;

  const [carData, setCarData] = useState([]);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [plateDate, setPlateDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [plate, setPlate] = useState(null);
  const [km, setKm] = useState(null);
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [carImageUri, setCarImageUri] = useState(null);

  const uploadCarImage = async () => {
    try {
      if (carImageUri) {
        const { uri } = await FileSystem.getInfoAsync(carImageUri, { size: true });
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const imageName = Date.now().toString();
        
        const storage = getStorage();
        const storageRef = ref(storage, `cars/${imageName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, blob);
        
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log("Image upload error:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(storageRef);
            
            const firestore = getFirestore();
            const carRef = doc(firestore, "Cars", carId);
            await updateDoc(carRef, { image: downloadURL });
            
            setCarData((prevCarData) => ({
              ...prevCarData,
              image: downloadURL,
            }));
            
            console.log("Image uploaded successfully");
          }
        );
      } else {
        console.log("No image selected");
      }
    } catch (error) {
      console.log("Image upload error:", error);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission denied", "Please grant permission to access the photo library.");
        return;
      }
      
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!pickerResult.cancelled) {
        setCarImageUri(pickerResult.uri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
    }
  };
  

  const [user, setUser] = useState([]);

  useEffect(() => {
    let timer;

    const fetchUserData = () => {
      getUserAsync((userData) => {
        setUser(userData);
      });
    };
    timer = setTimeout(fetchUserData, 5000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleSharePress = () => {
    if (!isNewCar) {
      setModalVisible(true);
    } else {
      console.log("Share");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchData = () => {
      if (!isNewCar) {
        setCarData([]);
        getCarById(carId, (data) => {
          setCarData(data);
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getBrandAsync((brandData) => {
      const brandOptions = brandData.map((brand) => brand.brand);
      setOptions(brandOptions);
    });
  }, []);

  useEffect(() => {
    getModelAsync((modelData) => {
      const modelOption = modelData
        .filter((model) => model.brand === brand)
        .map((model) => ({ model: model.model, brand: model.brand }));
      setOptions2(modelOption);
    });
  }, [brand]);

  useEffect(() => {
    if (carData?.brand) {
      setBrand(carData.brand);
    } else {
      setBrand(null);
    }

    if (carData?.model) {
      setModel(carData.model);
    } else {
      setModel(null);
    }

    if (carData?.plateDate) {
      const [month, day, year] = carData.plateDate.split("/");
      const parsedDate = new Date(`${year}-${month}-${day}`);
      setPlateDate(parsedDate);
      setSelectedDate(parsedDate);
    } else {
      setPlateDate(new Date());
      setSelectedDate(new Date());
    }

    if (carData?.plate) {
      setPlate(carData.plate);
    } else {
      setPlate(null);
    }

    if (carData?.km) {
      setKm(carData.km);
    } else {
      setKm(null);
    }
  }, [carData]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prevState) => !prevState);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const toggleDropdown2 = () => {
    setShowDropdown2(!showDropdown2);
  };

  const selectOption = (option) => {
    setBrand(option);
    toggleDropdown();
  };

  const selectOption2 = (option) => {
    setModel(option);
    toggleDropdown2();
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  // ...

  const validatePlate = (plate) => {
    const plateRegex =
      /^[A-Za-z]{2}-\d{2}-\d{2}$|^\d{2}-[A-Za-z]{2}-\d{2}$|^\d{2}-\d{2}-[A-Za-z]{2}$/;
    return plateRegex.test(plate);
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    handleDeleteCar(carId);
    navigation.navigate("HomePage");
  };

  const handleDeleteSharedCar = (carId) => {
    console.log("Delete shared car:", carId);
    setShowConfirmation(true);
  };

  const handleConfirmDeleteSharedCar = () => {
    setShowConfirmation(false);
    deleteSharedCarAsync(carId);
    navigation.navigate("HomePage");
  };

  return (
    <ScrollView>
    <View style={styles.oldContainer}>
    
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonShare} onPress={handleSharePress}>
          <Icon
            name="share"
            color="black"
            size={20}
            marginTop="15%"
            marginLeft="10%"
          />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer2}>
            <Text style={styles.titleModal}>Share</Text>
            <FlatList
              style={styles.flatlist}
              data={user}
              renderItem={({ item }) => (
                <User
                  key={item.id}
                  data={item}
                  navigation={navigation}
                  carId={carId}
                />
              )}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity onPress={closeModal} style={styles.modalButton2}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={styles.title}>
          {isNewCar ? "New Car" : `${brand}s page !`}
        </Text>

 
 
  <TouchableOpacity onPress={pickImage} style={{ width:100, marginRight:'60%'}}>
    {carData.image ? (
      <Image source={{ uri: carData.image }} style={styles.carimage} />
    ) : (
      <Text style={styles.placeholderText}>Select Image</Text>
    )}
  </TouchableOpacity>


<TouchableOpacity style={styles.uploadButton} onPress={uploadCarImage}>
    <Text style={styles.buttonText}>Upload</Text>
</TouchableOpacity>


        <View style={styles.buttonChange}>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => {
              if (validatePlate(plate)) {
                updateCarData(carId, brand, model, selectedDate, plate, km);
                navigation.navigate("HomePage");
              } else {
                console.log("Invalid plate format");
              }
            }}
          >
            <Text style={styles.buttonText}>{isNewCar ? "Add" : "Save"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => {
              if (isNewCar) {
                navigation.navigate("HomePage");
              } else {
                if (isSharedCar) {
                  handleDeleteSharedCar(carId);
                } else {
                  setShowConfirmation(true);
                }
              }
            }}
          >
            <Text style={styles.buttonText}>
  {isNewCar ? "Cancel" : isSharedCar ? "Remove" : "Delete"}
</Text>

          </TouchableOpacity>
        </View>
        <View style={styles.buttonMaintenance}>
          <TouchableOpacity
            style={styles.buttonMaintenances}
            onPress={() =>
              navigation.navigate("HistoryPage", { carId: carId, carKm: km,carImage :carData.image, })
            }
          >
            <Text style={styles.buttonText}>Maintenance History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonMaintenances}
            onPress={() =>
              navigation.navigate("MaintenancePage", {
                carId: carId,
                carKm: km,
                carImage :carData.image,
              })
            }
          >
            <Text style={styles.buttonText}>Next Maintenances</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Brand</Text>
            <TouchableOpacity style={styles.input} onPress={toggleDropdown}>
              {brand !== null ? (
                <Text style={styles.dropdownText}>{brand}</Text>
              ) : (
                <Text style={styles.placeholderText}>Select Brand</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Model</Text>
            <TouchableOpacity style={styles.input} onPress={toggleDropdown2}>
              {model ? (
                <Text style={styles.dropdownText}>{model}</Text>
              ) : (
                <Text style={styles.placeholderText}>Select Model</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Plate Date</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={{ width: "80%" }}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#888"
                value={formattedDate}
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
            <Text style={styles.label}>Plate</Text>
            <TextInput
              style={[styles.input, !validatePlate(plate) && styles.inputError]}
              placeholder="Plate"
              value={plate}
              onChangeText={setPlate}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Distance Traveled</Text>
            <TextInput
              style={styles.input}
              placeholder="Distance Traveled"
              value={km !== null ? km.toString() : ""}
              onChangeText={(text) => {
                const parsedValue = parseFloat(text);
                if (!isNaN(parsedValue)) {
                  setKm(parsedValue);
                }
              }}
              keyboardType="numeric"
            />
          </View>

          <Modal
            visible={showDropdown}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleDropdown}
          >
            <View style={styles.dropdownContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => selectOption(option)}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <Modal
            visible={showDropdown2}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleDropdown2}
          >
            <View style={styles.dropdownContainer2}>
              {options2.map((option) => (
                <TouchableOpacity
                  key={option.model}
                  onPress={() => selectOption2(option.model)}
                >
                  <Text>{option.model}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </View>
      </View>
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isSharedCar ? (
              <Text style={styles.modalText}>
                Are you sure you want to remove this shared car?
              </Text>
            ) : (
              <Text style={styles.modalText}>
                Are you sure you want to delete this car?
              </Text>
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              {isSharedCar ? (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirmDeleteSharedCar}
                >
                  <Text style={styles.modalButtonText}>Remove</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirmDelete}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
     
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  oldContainer: {
    flex: 1,
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    zIndex: -1,
    width: "97.5%",
  },
  menu: {
    position: "absolute",
    zIndex: 0,
  },
  uploadButton: {
    padding: 10,
    margin: 10,
    backgroundColor: "#E37D00",
    width: 90,
    zIndex: -1,
    marginTop: '5%',
    marginRight: '65%'
  },
  buttonChange: {
    marginTop: StatusBar.currentHeight - 140,
    marginLeft: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: -1,
  },
  buttonShare: {
    backgroundColor: "#E37D00",
    width: 30,
    zIndex: -1,
    height: 30,
    marginLeft: "95%",
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
  buttonMaintenances: {
    marginTop: 40,
    padding: 10,
    margin: 10,
    backgroundColor: "#FFD133",
    width: 170,
    alignItems: "center",
    zIndex: -1,
  },
  buttonMaintenance: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: -1,
  },
  buttonText: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    zIndex: -1,
  },
  addButton: {
    backgroundColor: "#E37D00",
    height: 40,
    marginLeft: 5,
    padding: 7,
    width: 340,
    fontSize: 20,
    zIndex: -1,
  },
  title: {
    marginTop: StatusBar.currentHeight - 20,
    marginLeft: "35%",
    fontSize: 20,
    color: "#E37D00",
    zIndex: -1,
  },
  titleModal: {
    marginTop: 20,
    fontSize: 20,
    color: "#E37D00",
  },
  carimage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: "65%",
    marginTop: "-10%",
    zIndex: -1,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#E37D00",
    zIndex: -1,
  },
  form: {
    width: 340,
    zIndex: -1,
  },
  formContainer: {
    height: "13%",
    marginBottom: 10,
    zIndex: -1,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: "#E37D00",
    zIndex: -1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    backgroundColor: "white",
    zIndex: -1,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 3,
  },
  dropdownContainer: {
    position: "absolute",
    top: "54%",
    left: "3%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    maxHeight: 150,
    width: "94%",
    overflow: "scroll",
  },
  dropdownContainer2: {
    position: "absolute",
    top: "64%",
    left: "3%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    maxHeight: 150,
    width: "94%",
    overflow: "scroll",
  },
  calendarButton: {
    backgroundColor: "transparent",
    marginLeft: 35,
  },
  inputBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: "#E37D00",
    borderRadius: 5,
  },
  modalButton2: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: "#E37D00",
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer2: {
    marginTop: StatusBar.currentHeight + 80,
    marginLeft: "15%",
    height: "70%",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#265865",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
  },

  flatlist: {
    marginTop: 30,
    marginLeft: 5,
    backgroundColor: "transparent",
    flex: 1,
    height: 100,
    zIndex: -1,
  },
});
