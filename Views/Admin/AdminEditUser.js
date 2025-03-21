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
} from "react-native";
import { Feather } from "react-native-vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import Menu from "../../components/SideBarMenu";
import profileImage from "../../assets/images/profile.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserByIdAsync } from "../../services";
const options = ["Mirandela", "Bragança", "Porto", "Coimbra", "Vila Real"];

export default function EditUserView({ navigation, route }) {
  const { userId } = route.params;
  const isNewCity = false;
  const [userData, setUserData] = useState(null);
  const [updatedUserName, setupdatedUserName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
    setupdatedUserName("");
    setUserData(null);
    if (!isNewCity) {
      getUserByIdAsync(userId, (data) => {
        setUserData(data);
        setupdatedUserName(data?.username || "");
      });
    }
  }, [userId, isNewCity]);

  return (
    <View style={styles.oldContainer}>
      <View style={styles.content}>
        <View style={styles.button50}>
          <TouchableOpacity onPress={this.handleProfileClick}>
            <Image source={profileImage} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonChange}>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => navigation.navigate("Users Management")}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => navigation.navigate("Users Management")}
          >
            <Text style={styles.buttonText}>Delete</Text>
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
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => selectOption(option)}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
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
                  value={userData?.pw || ""}
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
    width: 335,
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
    marginLeft: "5%",
    width: 90,
    height: 90,
    borderRadius: 55,
  },
  formTop: {
    marginTop: "5%",
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
    marginTop: StatusBar.currentHeight - 110,
    marginLeft: "30%",
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
    top: "65.5%",
    left: "5%",
    right: "50%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    maxHeight: 150,
    overflow: "scroll",
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
