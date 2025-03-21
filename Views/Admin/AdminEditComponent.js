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
  getComponentByIdAsync,
  updateComponent,
  handleDeleteComponent,
} from "../../services";

export default function AdminEditComponentView({ navigation, route }) {
  const { componentId } = route.params;
  const isNewComponent = componentId === 0;
  const [componentData, setComponentData] = useState(null);
  const [updatedComponentName, setComponentName] = useState("");
  const [updatedPeriocity, setPeriocity] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setComponentName("");
    setPeriocity("");
    setComponentData(null);
    if (!isNewComponent) {
      getComponentByIdAsync(componentId, (data) => {
        setComponentData(data);
        setComponentName(data.name);
        setPeriocity(data.periodicity);
      });
    }
  }, [componentId, isNewComponent]);

  const handleSave = () => {
    if (updatedComponentName && updatedPeriocity) {
      const componentName = updatedComponentName;
      const componentPeriocity = updatedPeriocity;
      updateComponent(componentId, componentName, componentPeriocity);
      navigation.navigate("Components");
    } else {
      console.log("empty");
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    handleDeleteComponent(componentId);
    navigation.navigate("Components");
  };

  return (
    <View style={styles.oldContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isNewComponent ? "New Component" : "Edit Component"}
        </Text>
        <View style={styles.buttonChange}>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => {
              if (isNewComponent) {
                navigation.navigate("Components");
              } else {
                setShowConfirmation(true);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {isNewComponent ? "Cancel" : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formTopContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Component</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Component"
                value={updatedComponentName}
                onChangeText={setComponentName}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Periodicity</Text>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Periodicity"
                value={updatedPeriocity.toString()}
                onChangeText={(text) => setPeriocity(parseInt(text))}
                keyboardType="numeric"
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
