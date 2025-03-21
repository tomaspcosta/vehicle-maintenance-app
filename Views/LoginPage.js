import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import logo from "../assets/images/logo.png";
import PropTypes from "prop-types";
import { FontAwesome } from "@expo/vector-icons";
import { loginUserAsync } from "../services";

LoginView.propTypes = {
  placeholder: PropTypes.string,
};

export default function LoginView({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    setEmailError(false);
    setPasswordError(false);
    setErrorMessage("");

    if (email.trim() === "") {
      setEmailError(true);
    }
    if (password.trim() === "") {
      setPasswordError(true);
    }
    if (email.trim() !== "" && password.trim() !== "") {
      loginUserAsync([email, password], (errorCode) => {
        if (errorCode === "auth/invalid-email" || errorCode === "auth/wrong-password") {
          setEmailError(true);
          setPasswordError(true);
          setErrorMessage("Invalid email or password");
        } else {
          console.log("Login error:", errorCode);
          setErrorMessage("An error occurred during login");
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
          <View style={{ height: 10 }}></View>
        </View>
        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError && styles.errorInput]}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email Address"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, passwordError && styles.errorInput]}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!passwordVisible}
                placeholder="Password"
                placeholderTextColor="#999"
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
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <View style={styles.createAccount}>
            <Text style={styles.createAccountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.createAccountText, styles.link]}>Sign up</Text>
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
    width: "100%",
    backgroundColor: "#142F36",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "25%",
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 270,
    height: 150,
    resizeMode: "contain",
  },
  form: {
    width: 250,
  },
  formContainer: {
    marginBottom: 10,
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
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: "#E37D00",
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  createAccount: {
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
  createAccountText: {
    textAlign: "center",
    color: "white",
  },
  passwordButton: {
    padding: 5,
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
    width: 50,
    marginTop: "-20%",
    marginLeft: "77%",
  },
  errorInput: {
    borderColor: "red",
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  link: {
    color: "skyblue",
  },
});
