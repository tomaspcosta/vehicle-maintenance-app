import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image , TouchableOpacity } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useState } from "react";
import StartUpView from "./Views/StartUpPage";
import LoginView from "./Views/LoginPage";
import SignUpView from "./Views/SignUpPage";
import HomePageView from "./Views/HomePage";
import HistoryPageView from "./Views/Maintenance/HistoryPage";
import MaintenancePageView from "./Views/Maintenance/MaintenancePage";
import AddNewMaintenancePageView from "./Views/Maintenance/AddNewMaintenancePage";
import CarPageView from "./Views/CarPage";
import EditUserView from "./Views/EditUserPage";
import CalendarPageView from "./Views/CalendarPage";
import AdminEditModelView from "./Views/Admin/AdminEditModel";
import AdminModelsView from "./Views/Admin/AdminModels";
import AdminComponentView from "./Views/Admin/AdminComponents";
import AdminUsersView from "./Views/Admin/AdminUsers";
import AdminBrandView from "./Views/Admin/AdminBrand";
import AdminCityView from "./Views/Admin/AdminCity";
import AdminEditComponentView from "./Views/Admin/AdminEditComponent";
import AdminEditUserView from "./Views/Admin/AdminEditUser";
import AdminEditBrandView from "./Views/Admin/AdminEditBrand";
import AdminEditCityView from "./Views/Admin/AdminEditCity";  

import { Icon } from "react-native-elements";
import { logoutUserAsync, subescribeOnAuthStateChanged, getUserByIdAsync, getCurrentUser } from "./services";


const LoginStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomePage"
      component={HomePageView}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="HistoryPage"
      component={HistoryPageView}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MaintenancePage"
      component={MaintenancePageView}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AddNewMaintenancePage"
      component={AddNewMaintenancePageView}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CarPage"
      component={CarPageView}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const CustomDrawerContent = ({ email, username, image, ...props }) => {
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.closeDrawer();
    navigation.navigate("Home", { screen: "Home" });
  };

  const handleLogout = async () => {
    try {
      await logoutUserAsync();
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image source={{ uri: image }} style={styles.drawerImage} />
        <Text style={styles.drawerText}>{username}</Text>
        <Text style={styles.drawerText}>{email}</Text>
      </View>
      <DrawerItemList
        {...props}
        onItemPress={({ route }) => {
          if (route.name === "Home") {
            handleHomePress();
          } else {
            navigation.navigate(route.name);
          }
        }}
      />
      <TouchableOpacity onPress={handleLogout}>
        <View style={styles.menuItemContainer}>
          <Icon name="log-out-outline" type="ionicon" color="#3e4142" size={24} />
          <Text style={styles.menuItemText}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = getCurrentUser()?.uid;
  const [userData, setUserData] = useState(null);
  const [updatedUserName, setupdatedUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
 
  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = () => {
        setupdatedUserName("");
        setUserData(null);
        getUserByIdAsync(userId, (data) => {
          setUserData(data);
          setupdatedUserName(data?.username || "");
          setIsAdmin(data?.admin === 1);
        });
      };
  
      fetchData();
    }
  }, [isLoggedIn, userId]);
  

  useEffect(() => {
    subescribeOnAuthStateChanged((userCredential) => {
      setIsLoggedIn(userCredential !== null);
    });
  }, []);

  return (
    <>
    {isLoggedIn && 
    <NavigationContainer>
      <Drawer.Navigator
  drawerContent={(props) => (
    <CustomDrawerContent
      {...props}
      email={userData?.email}
      username={userData?.username}
      image={userData?.image}
    />
  )}
  screenOptions={{
    drawerStyle: {
      backgroundColor: "#E37D00",
    },
  }}
>
        <Drawer.Screen
          name="Home"
          component={HomeStack}
          options={() => ({
            drawerIcon: ({ color, size }) => (
              <Icon
                name="home-outline"
                type="ionicon"
                color={color}
                size={size}
              />
            ),
            drawerActiveTintColor: "white",
            headerTitle: () => (
              <Text style={{ color: "#E37D00", paddingLeft: "7%", fontSize:17 }}>
                Welcome Back {userData?.username}!
              </Text>
            ),
            headerStyle: { backgroundColor: "#142F36" },
          })}
        />
        <Drawer.Screen
          name="Calendar"
          component={CalendarPageView}
          options={{
            backgroundColor: "#E37D00",
            drawerIcon: ({ color, size }) => (
              <Icon
                name="calendar-outline"
                type="ionicon"
                color={color}
                size={size}
              />
            ),
            drawerActiveTintColor: "white",
            headerTitle: "Your Calendar!",
            headerTitleStyle: { color: "#E37D00", paddingLeft: "25%" },
            headerStyle: { backgroundColor: "#142F36" },
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={EditUserView}
          options={{
            backgroundColor: "#E37D00",
            drawerIcon: ({ color, size }) => (
              <Icon
                name="person-circle-outline"
                type="ionicon"
                color={color}
                size={size}
              />
            ),
            drawerActiveTintColor: "white",
            headerTitle: "Edit Profile",
            headerTitleStyle: { color: "#E37D00", paddingLeft: "25%" },
            headerStyle: { backgroundColor: "#142F36" },
          }}
        />


        {isAdmin && (
          <>
            <Drawer.Screen
              name="Users Management"
              component={AdminUsersView}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="people-outline"
                    type="ionicon"
                    color={color}
                    size={size}
                  />
                ),
                drawerActiveTintColor: "white",
                headerTitle: "Admin Panel",
                headerTitleStyle: { color: "#E37D00", paddingLeft: "15%" },
                headerStyle: { backgroundColor: "#142F36" },
              }}
            />
            <Drawer.Screen
              name="Components"
              component={AdminComponentView}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="build-outline"
                    type="ionicon"
                    color={color}
                    size={size}
                  />
                ),
                drawerActiveTintColor: "white",
                headerTitle: "Admin Panel",
                headerTitleStyle: { color: "#E37D00", paddingLeft: "15%" },
                headerStyle: { backgroundColor: "#142F36" },
              }}
            />
            <Drawer.Screen
              name="Brands"
              component={AdminBrandView}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="car-outline"
                    type="ionicon"
                    color={color}
                    size={size}
                  />
                ),
                drawerActiveTintColor: "white",
                headerTitle: "Admin Panel",
                headerTitleStyle: { color: "#E37D00", paddingLeft: "15%" },
                headerStyle: { backgroundColor: "#142F36" },
              }}
            />
            <Drawer.Screen
              name="Models"
              component={AdminModelsView}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="speedometer-outline"
                    type="ionicon"
                    color={color}
                    size={size}
                  />
                ),
                drawerActiveTintColor: "white",
                headerTitle: "Admin Panel",
                headerTitleStyle: { color: "#E37D00", paddingLeft: "15%" },
                headerStyle: { backgroundColor: "#142F36" },
              }}
            />
            <Drawer.Screen
              name="Cities"
              component={AdminCityView}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Icon
                    name="location-outline"
                    type="ionicon"
                    color={color}
                    size={size}
                  />
                ),
                drawerActiveTintColor: "white",
                headerTitle: "Admin Panel",
                headerTitleStyle: { color: "#E37D00", paddingLeft: "15%" },
                headerStyle: { backgroundColor: "#142F36" },
              }}
            />
            <Drawer.Screen
              name="Users Management Edit"
              component={AdminEditUserView}
              options={{ drawerItemStyle: { height: 0 },headerTitle: "", headerStyle: { backgroundColor: "#142F36" },}}
            />
            <Drawer.Screen
              name="Components Edit"
              component={AdminEditComponentView}
              options={{ drawerItemStyle: { height: 0 },headerTitle: "", headerStyle: { backgroundColor: "#142F36" },}}
            />
            <Drawer.Screen
              name="Brands Edit"
              component={AdminEditBrandView}
              options={{ drawerItemStyle: { height: 0 },headerTitle: "", headerStyle: { backgroundColor: "#142F36" },}}
            />
            <Drawer.Screen
              name="Models Edit"
              component={AdminEditModelView}
              options={{ drawerItemStyle: { height: 0 },headerTitle: "", headerStyle: { backgroundColor: "#142F36" },}}
            />
            <Drawer.Screen
              name="Cities Edit"
              component={AdminEditCityView}
              options={{ drawerItemStyle: { height: 0 },headerTitle: "", headerStyle: { backgroundColor: "#142F36" },}}
            />
          </>
        )}

        
      </Drawer.Navigator>
    </NavigationContainer>
    }
    {!isLoggedIn &&

    <NavigationContainer>
      <LoginStack.Navigator screenOptions={{headerShown: false}}>
        <LoginStack.Screen name="StartUp" component={StartUpView }/>
        <LoginStack.Screen name="Login" component={LoginView }/>
        <LoginStack.Screen name= "SignUp" component={SignUpView }/>      
      </LoginStack.Navigator>

    </NavigationContainer>
    }
  </>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: "column",
    alignItems: "baseline",
    padding: 16,
    backgroundColor: "black",
    marginTop: "-15%",
  },
  drawerImage: {
    marginTop: "20%",
    width: 80,
    height: 80,
    marginRight: 8,
    resizeMode: "contain",
    borderRadius: 65,
    marginBottom: 5,
  },
  drawerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E37D00",
  },
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "650%",
    color: "black",
    marginLeft: 10,
    marginBottom: 50,
  },
  menuItemText: {
    marginLeft: 30,
    fontSize: 15,
    color:'#3e4142',
  },
});
