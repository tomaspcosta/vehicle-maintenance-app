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
} from "react-native";
import { getHistoryAsync } from "../../services";
import Component from "../../components/Component";
import carimage from "../../assets/images/car.png";
import { Icon } from "react-native-elements";
import Menu from "../../components/SideBarMenu";
import Picker from "react-native-picker";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getMaintenancesByIdAsync,
  updateMaintenance,
  handleDeleteMaintenance,
  getComponentAsync,
  getCurrentUser
} from "../../services";

export default function AddNewMaintenanceView({ navigation, route }) {
  const userId = getCurrentUser()?.uid;;
  const { managId, carId, carKm, carImage } = route.params;
  const isNewMan = managId === 0;
  const [mainData, setMainData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [options, setOptions] = useState([]);

  //datepicker
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
    setMainData(null);
    if (!isNewMan) {
      getMaintenancesByIdAsync(managId, (data) => {
        if (Array.isArray(data)) {
          const [maintenance] = data;
          setMainData(maintenance);
          setSelectedOption(maintenance?.component);
          const [month, day, year] = maintenance?.date.split("/");
          const parsedDate = new Date(`${year}-${month}-${day}`);
          setSelectedDate(parsedDate);
        }
      });
    }
  }, []);
  

  useEffect(() => {
    getComponentAsync((componentData) => {
      setOptions(componentData);
    });
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  const handleSave = () => {
    if (!selectedOption) {
      return;
    }
    
    const newDate = selectedDate;
    const newComponent = selectedOption.name;
    const sumPeriodicity = selectedOption.periodicity + carKm;
    updateMaintenance(managId, newDate, newComponent, carId, userId, sumPeriodicity);
    navigation.goBack();
  };
  

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    handleDeleteMaintenance(managId);
    navigation.goBack();
  };

  return (
    <View style={styles.oldContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isNewMan ? "New Maintenance!" : "Update Maintenance!"}
        </Text>
        <Image source={{ uri: carImage }} style={styles.carimage} />
        <View style={styles.buttonChange}>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => {
              if (isNewMan) {
                navigation.goBack();
              } else {
                setShowConfirmation(true);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {isNewMan ? "Cancel" : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Maintenance Date</Text>
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
  <Text style={styles.label}>Component</Text>
  <TouchableOpacity style={styles.input} onPress={toggleDropdown}>
    {selectedOption ? (
      <Text style={styles.placeholderText}>
        {selectedOption.name}
      </Text>
    ) : (
      <Text style={styles.placeholderText}>Select Component</Text>
    )}
  </TouchableOpacity>
</View>

          <Modal
            visible={showDropdown}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleDropdown}
          >
            <View style={styles.dropdownContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => selectOption(option)}
                >
                  <Text>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <Modal
            visible={showConfirmation}
            transparent
            animationType="fade"
            onRequestClose={() => setShowConfirmation(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want to delete this Maintenance?
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowConfirmation(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleConfirmDelete}
                  >
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
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
  container: {
    flex: 1,
    alignItems: "center",
    zIndex: -1,
    width: "94%",
  },
  menu: {
    position: "absolute",
    zIndex: 0,
  },
  buttonChange: {
    marginTop: StatusBar.currentHeight - 80,
    marginLeft: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: -1,
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
  buttonText: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    zIndex: -1,
  },
  title: {
    marginTop: StatusBar.currentHeight + 80,
    marginLeft: "35%",
    fontSize: 20,
    color: "#E37D00",
    zIndex: -1,
    textAlign: "center",
  },
  carimage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: "65%",
    marginTop: "-15%",
    zIndex: -1,
  },
  form: {
    marginTop: "15%",
    width: 340,
    zIndex: -1,
  },
  formContainer: {
    marginTop: "7%",
    height: "23%",
    marginBottom: 10,
    zIndex: -1,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: "#E37D00",
    zIndex: -1,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    backgroundColor: "white",
    zIndex: -1,
    height: 30,
  },
  placeholderText: {
    marginTop: 5,
  },
  dropdownContainer: {
    position: "absolute",
    top: "74.5%",
    left: "3%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    maxHeight: 250,
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
    padding: 12,
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
  modalButtonText: {
    fontSize: 16,
    color: "white",
  },
});
