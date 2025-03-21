import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  StatusBar,
  ScrollView,
  Alert
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCityAsync, registerUserAsync } from "../services";

export default function RegisterView({ navigation }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [options, setOptions] = useState([]);


  useEffect(() => {
    getCityAsync((cityData) => {
      const cityOptions = cityData.map((city) => city.name);
      setOptions(cityOptions);
    });
  }, []);

  //pasword
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  //dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

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

  // Error Messages
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthdayValidationError, setBirthdayValidationError] = useState("");
  const [streetNameError, setStreetNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleRegister = () => {
    const birthday = selectedDate;
    const city = selectedOption;

    // Check age
    const today = new Date();
    const ageDiff = today - birthday;
    const ageDate = new Date(ageDiff);
    const years = ageDate.getUTCFullYear() - 1970;
    const isAdult = years >= 18;

    if (!isAdult) {
      setBirthdayValidationError("Must be 18 years or older to register.");
      return;
    } else {
      setBirthdayValidationError("");
    }

    // Check null variables
    setUsernameError(username ? "" : "Please fill in username.");
    setEmailError(email ? "" : "Please fill in email.");
    setFirstNameError(firstName ? "" : "Please fill in first name.");
    setLastNameError(lastName ? "" : "Please fill in last name.");
    setBirthdayValidationError(birthday ? "" : "Please select a birthday.");
    setStreetNameError(streetName ? "" : "Please fill in street name.");
    setCityError(city ? "" : "Please select a city.");
    setZipCodeError(zipCode ? "" : "Please fill in zip code.");
    setPasswordError(password ? "" : "Please fill in password.");
    setConfirmPasswordError(
      confirmPassword ? "" : "Please fill in confirm password."
    );

    // Check length's
    setUsernameError(
      username.length >= 5 ? "" : "Username must have at least 5 characters."
    );

    
    setPasswordError(
      password.length >= 6 ? "" : "Password must have at least 6 characters."
    );

    // Check passwords match
    setConfirmPasswordError(
      password === confirmPassword ? "" : "Passwords do not match."
    );

    // Check zip-code format
    const zipCodePattern = /^\d{4}-\d{3}$/;
    setZipCodeError(
      zipCode.match(zipCodePattern) ? "" : "Invalid zip code format."
    );

    // Check email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(email.match(emailPattern) ? "" : "Invalid email format.");

    // Check errors
    if (
      !isAdult ||
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      !birthday ||
      !streetName ||
      !city ||
      !zipCode ||
      !password ||
      !confirmPassword ||
      username.length < 5 ||
      password.length < 6 ||
      password !== confirmPassword ||
      !zipCode.match(zipCodePattern) ||
      !email.match(emailPattern)
    ) {
      return;
    }

    //Call handleCreateUser

    registerUserAsync(
      email,
      password,
      username,
      firstName,
      lastName,
      birthday,
      streetName,
      city,
      zipCode,
      (error) => {
        if (error) {
          Alert.alert(error);
        } else {
          navigation.navigate("Login");
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            {usernameError !== "" && (
              <Text style={styles.errorMessage}>{usernameError}</Text>
            )}
            <View
              style={[
                styles.inputBoxContainer,
                usernameError !== "" && styles.errorInputBoxContainer,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  usernameError !== "" && styles.errorPasswordInput,
                ]}
                onChangeText={setUsername}
                value={username}
              />
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email Address</Text>
            {emailError !== "" && (
              <Text style={styles.errorMessage}>{emailError}</Text>
            )}
            <View
              style={[
                styles.inputBoxContainer,
                emailError !== "" && styles.errorInputBoxContainer,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  emailError !== "" && styles.errorPasswordInput,
                ]}
                onChangeText={setEmail}
                value={email}
              />
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            {firstNameError !== "" && (
              <Text style={styles.errorMessage}>{firstNameError}</Text>
            )}
            <View
              style={[
                styles.inputBoxContainer,
                firstNameError !== "" && styles.errorInputBoxContainer,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  firstNameError !== "" && styles.errorPasswordInput,
                ]}
                onChangeText={setFirstName}
                value={firstName}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Last Name</Text>
            {lastNameError !== "" && (
              <Text style={styles.errorMessage}>{lastNameError}</Text>
            )}
            <View
              style={[
                styles.inputBoxContainer,
                lastNameError !== "" && styles.errorInputBoxContainer,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  lastNameError !== "" && styles.errorPasswordInput,
                ]}
                onChangeText={setLastName}
                value={lastName}
              />
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Birthday</Text>
            {birthdayValidationError !== "" && (
              <Text style={styles.errorMessage}>{birthdayValidationError}</Text>
            )}
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  birthdayValidationError !== "" && styles.errorPasswordInput,
                ]}
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
            {streetNameError !== "" && (
              <Text style={styles.errorMessage}>{streetNameError}</Text>
            )}
            <View
              style={[
                styles.inputBoxContainer,
                streetNameError !== "" && styles.errorInputBoxContainer,
              ]}
            >
              <TextInput
                style={[
                  styles.passwordInput,
                  streetNameError !== "" && styles.errorPasswordInput,
                ]}
                onChangeText={setStreetName}
                value={streetName}
              />
            </View>
          </View>

          <View style={styles.form50}>
            <View
              style={[styles.formContainer, { marginRight: 10, width: "50%" }]}
            >
              <Text style={styles.label}>City</Text>
              {cityError !== "" && (
                <Text style={styles.errorMessage}>{cityError}</Text>
              )}
              <TouchableOpacity
                style={[
                  styles.inputBoxContainer,
                  { height: 30 },
                  cityError !== "" && styles.errorInputBoxContainer,
                ]}
                onPress={toggleDropdown}
              >
                {selectedOption ? (
                  <Text> {selectedOption}</Text>
                ) : (
                  <Text> Select City</Text>
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

            <View style={[styles.formContainer, { flex: 1 }]}>
              <Text style={styles.label}>Zip-Code</Text>
              {zipCodeError !== "" && (
                <Text style={styles.errorMessage}>{zipCodeError}</Text>
              )}
              <View
                style={[
                  styles.inputBoxContainer,
                  zipCodeError !== "" && styles.errorInputBoxContainer,
                ]}
              >
                <TextInput
                  style={[
                    styles.passwordInput,
                    zipCodeError !== "" && styles.errorPasswordInput,
                  ]}
                  onChangeText={setZipCode}
                  value={zipCode}
                />
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Password</Text>
            {passwordError !== "" && (
              <Text style={styles.errorMessage}>{passwordError}</Text>
            )}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  passwordError !== "" && styles.errorPasswordInput,
                ]}
                secureTextEntry={!passwordVisible}
                onChangeText={setPassword}
                value={password}
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

          <View style={styles.formContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            {confirmPasswordError !== "" && (
              <Text style={styles.errorMessage}>{confirmPasswordError}</Text>
            )}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  confirmPasswordError !== "" && styles.errorPasswordInput,
                ]}
                secureTextEntry={!confirmPasswordVisible}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
              <TouchableOpacity
                style={styles.passwordButton}
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <View style={{ backgroundColor: "transparent" }}>
                  <FontAwesome
                    name={confirmPasswordVisible ? "eye-slash" : "eye"}
                    size={20}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signIn}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.signInText, styles.link]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
    height: "100%",
    marginTop: StatusBar.currentHeight + 20,
    backgroundColor: "#142F36",
  },
  form: {
    flexDirection: "column",
    maxWidth: 380,
  },
  form50: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formContainer: {
    marginBottom: 0,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#E37D00",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: "#E37D00",
    width: 330,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
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
  },
  passwordInput: {
    flex: 1,
  },
  passwordButton: {
    padding: 5,
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  backButton: {
    position: "absolute",
    top: 5,
    left: 5,
    marginTop: 60,
  },
  signIn: {
    color: "white",
    textAlign: "center",
    height: 70,
  },
  signInText: {
    textAlign: "center",
    color: "white",
  },
  link: {
    color: "skyblue",
  },
  dropdownContainer: {
    position: "absolute",
    top: "62.5%",
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
    padding: 5,
  },
  calendarButton: {
    backgroundColor: "transparent",
    right: "10%",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: "-5%",
    textAlign: "right",
  },
  errorInputBoxContainer: {
    borderColor: "red",
  },

  errorPasswordInput: {
    borderColor: "red",
  },
});
