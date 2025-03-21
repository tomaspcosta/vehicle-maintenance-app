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
import {
  getModelByIdAsync,
  updateModel,
  handleDeleteModel,
  getBrandAsync,
} from "../../services";

export default function AdminEditModelView({ navigation, route }) {
  const { modelId } = route.params;
  const isNewModel = modelId === 0;
  const [modelData, setModelData] = useState(null);
  const [updatedModel, setModel] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setSelectedOption("");
    setModel("");
    setModelData(null);
    if (!isNewModel) {
      getModelByIdAsync(modelId, (data) => {
        setModelData(data);
        setSelectedOption(data.brand);
        setModel(data.model);
      });
    }
  }, [modelId, isNewModel]);

  useEffect(() => {
    getBrandAsync((brandData) => {
      const brandOptions = brandData.map((brand) => brand.brand);
      setOptions(brandOptions);
    });
  }, [options]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  const handleSave = () => {
    if (selectedOption && updatedModel) {
      const brandName = selectedOption;
      const modelName = updatedModel;
      updateModel(modelId, brandName, modelName);
      navigation.navigate("Models");
    } else {
      console.log("empty");
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    handleDeleteModel(modelId);
    navigation.navigate("Models");
  };

  return (
    <View style={styles.oldContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isNewModel ? "New Model" : "Edit Model"}
        </Text>

        <View style={styles.buttonChange}>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => {
              if (isNewModel) {
                navigation.navigate("Models");
              } else {
                setShowConfirmation(true);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {isNewModel ? "Cancel" : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formTopContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Brand</Text>
            <TouchableOpacity
              style={styles.inputBoxContainer}
              onPress={toggleDropdown}
            >
              {selectedOption ? (
                <Text style={styles.dropdownText}>{selectedOption}</Text>
              ) : (
                <Text style={styles.placeholderText}>
                  {isNewModel ? "Select Brand" : "Brand"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Model</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Model"
                value={updatedModel}
                onChangeText={setModel}
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
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => selectOption(option)}
                >
                  <Text>{option}</Text>
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
            <Text style={styles.modalText}>
              Are you sure you want to delete this Component?
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
  oldContainer: {
    flex: 1,
    backgroundColor: "#142F36",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: 335,
    height: "100%",
    zIndex: -1,
  },
  menu: {
    position: "absolute",
    zIndex: 0,
  },
  title: {
    marginTop: StatusBar.currentHeight + 80,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    zIndex: -1,
    textAlign: "center",
  },
  buttonChange: {
    marginTop: 30,
    marginLeft: "2%",
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
  formTopContainer: {
    marginTop: "50%",
    zIndex: -1,
  },
  formContainer: {
    marginBottom: 5,
    bottom: 150,
    zIndex: -1,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#E37D00",
    zIndex: -1,
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    zIndex: -1,
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
  dropdownContainer: {
    position: "absolute",
    top: "52.5%",
    left: "3.5%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    maxHeight: 150,
    width: "93%",
    overflow: "scroll",
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
