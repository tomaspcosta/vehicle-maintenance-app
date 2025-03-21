import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import { getCityByIdAsync, updateCity, handleDeleteCity } from "../../services";

export default function AdminEditCityView({ navigation, route }) {
  const { cityId } = route.params;
  const isNewCity = cityId === 0;
  const [cityData, setCityData] = useState(null);
  const [updatedCityName, setUpdatedCityName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setUpdatedCityName("");
    setCityData(null);
    if (!isNewCity) {
      getCityByIdAsync(cityId, (data) => {
        setCityData(data);
        setUpdatedCityName(data.name);
      });
    }
  }, [cityId, isNewCity]);

  const handleSave = () => {
    if (updatedCityName) {
      const cityName = updatedCityName;
      updateCity(cityId, cityName);
      navigation.navigate("Cities");
    } else {
      console.log("empty");
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    handleDeleteCity(cityId);
    navigation.navigate("Cities");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {cityData ? `Edit ${cityData.name}` : isNewCity ? "Add City" : ""}
        </Text>

        <View style={styles.buttonChange}>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => setShowConfirmation(true)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formTopContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>City</Text>
            <View
              style={[
                styles.inputBoxContainer,
                updatedCityName ? null : styles.redBorder,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="City"
                value={updatedCityName}
                onChangeText={(text) => setUpdatedCityName(text)}
              />
            </View>
          </View>
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
            <Text style={styles.modalText}>
              Are you sure you want to delete this city?
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
    width: 335,
    height: "100%",
  },
  title: {
    marginTop: StatusBar.currentHeight + 80,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  buttonChange: {
    marginTop: 30,
    marginLeft: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonSave: {
    padding: 10,
    margin: 10,
    backgroundColor: "#E37D00",
    width: 100,
    alignItems: "center",
  },
  buttonDelete: {
    padding: 10,
    margin: 10,
    backgroundColor: "red",
    width: 100,
    alignItems: "center",
  },
  formTopContainer: {
    marginTop: "50%",
  },
  formContainer: {
    marginBottom: 5,
    bottom: 150,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#E37D00",
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  inputBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    height: 35,
    padding: 2,
    borderRadius: 5,
    marginBottom: 5,
    position: "relative",
  },
  passwordInput: {
    flex: 1,
  },
  redBorder: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    height: 35,
    padding: 2,
    borderRadius: 5,
    marginBottom: 5,
    position: "relative",
    borderColor: "red",
    borderWidth: 2,
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
