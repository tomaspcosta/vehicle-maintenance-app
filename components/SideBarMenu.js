import React, { useState } from "react";
import {View,Text, StyleSheet,TouchableOpacity,Image, TouchableWithoutFeedback, StatusBar} from "react-native";
import profileImage from "../assets/images/profile.png";
import { Icon } from "react-native-elements";
import StartUpView from "../Views/StartUpPage";

export default function Menu(props) {
  const admin = true;
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handlePress = () => {
    setIsOpen(!isOpen);
    setShowProfile(!showProfile);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowProfile(false);
  };

  return (
    <TouchableWithoutFeedback style={styles.index}>
      <View style={styles.menu}>
        <View>
          <TouchableOpacity onPress={handlePress} style={styles.menuButton}>
            <Icon size={40} name="menu-outline" type="ionicon" color="white" />
          </TouchableOpacity>
        </View>

        {isOpen && (
          <View>
            {showProfile && (
              <View style={styles.profileContainer}>
                <Image source={profileImage} style={styles.profileImage} />
                <Text style={styles.username}>username</Text>
                <Text style={styles.email}>email@example.com</Text>
              </View>
            )}
            {!admin ? (
              <View style={styles.menuItems}>
                <TouchableOpacity       onPress={() => props.navigation.navigate('HomePage')}>
                  <View style={styles.menuItemContainer}>
                    <Icon
                      name="home-outline"
                      type="ionicon"
                      color="black"
                      size={25}
                    />
                    <Text style={styles.menuItemText}>Home</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                  <View style={styles.menuItemContainer}>
                    <Icon
                      name="calendar-outline"
                      type="ionicon"
                      color="black"
                      size={25}
                    />
                    <Text style={styles.menuItemText}>Calendar</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                  <View style={styles.menuItemContainer}>
                    <Icon
                      name="person-circle-outline"
                      type="ionicon"
                      color="black"
                      size={25}
                    />
                    <Text style={styles.menuItemText}>Profile</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                  <View style={styles.menuItemContainer}>
                    <Icon
                      name="log-out-outline"
                      type="ionicon"
                      color="black"
                      size={25}
                    />
                    <Text style={styles.menuItemText}>Sign Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.menuItems}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="home-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Home</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="people-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Users Managment</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="build-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Components</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="car-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Brands</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="speedometer-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Models</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="location-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Cities</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')}>
                    <View style={styles.menuItemContainer}>
                      <Icon
                        name="log-out-outline"
                        type="ionicon"
                        color="black"
                        size={25}
                      />
                      <Text style={styles.menuItemText}>Sign Out</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.closeMenu} onPress={handleClose} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  index:{
    zIndex:1,
  },
  menu: {
    position: "absolute",
    marginTop: StatusBar.currentHeight || 0,
    right:"90%",
    width: "50%",
    height: "5%",
  },
  menuButton: {
    alignItems: "flex-end",
  },
  profileContainer: {
    position: "absolute",
    left: "65%",
    top: -50,
    zIndex: 2,
    width: "1100%",
    padding: 10,
    backgroundColor: "#000",
    marginTop: 10,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#E37D00",
    marginLeft: 25,
  },
  email: {
    marginTop: 5,
    fontSize: 14,
    color: "#E37D00",
    marginLeft: 25,
  },
  profileImage: {
    marginTop: 25,
    marginLeft: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  menuItems: {
    backgroundColor: "#E37D00",
    padding: 10,
    top: 118,
    width: "1100%",
    left: -10,
    left: "70%",
  },
  closeMenu: {
    marginTop: 130,
    height: 500,
    width: 500,
    backgroundColor: "transparent",
    left: -50,
    
  },
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "650%",
    color: "black",
    marginLeft: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 18,
  },
});
