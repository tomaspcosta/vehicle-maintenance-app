import staticCars from "./data/cars.json";
import staticSharedCars from "./data/carsShared.json";
import staticHistory from "./data/history.json";
import staticNext from "./data/next.json";
import staticModel from "./data/models.json";
import staticComponent from "./data/components.json";
import staticUser from "./data/users.json";
import staticBrand from "./data/brands.json";
import staticCity from "./data/cities.json";
import { db, auth } from "./firebase.config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  setDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  querySnapshot,
} from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const SIMULATION = false;



const getCarAsync = (onDataRetrieved) => {
  let cars = [];
  if (SIMULATION) {
    cars = staticCars;
    onDataRetrieved(cars);
  } else {
    const unsubscribe = onSnapshot(
      query(collection(db, "Cars"), where("userId", "==", getCurrentUser().uid)),
      (snapshot) => {
        cars = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        onDataRetrieved(cars);
      }
    );

    return unsubscribe;
  }
};


const shareCarWithUser = async (carId, targetUserId) => {
  console.log(carId);
  console.log(targetUserId);
  try {
    const carRef = doc(db, "Cars", carId);
    const carDoc = await getDoc(carRef);

    if (carDoc.exists()) {
      const carData = carDoc.data();

      let updatedSharedUsers = [];
      if (carData && Array.isArray(carData.sharedUsers)) {
        if (!carData.sharedUsers.includes(targetUserId)) {
          updatedSharedUsers = [...carData.sharedUsers, targetUserId];
        } else {
          console.log("User is already shared with.");
          return;
        }
      } else {
        updatedSharedUsers = [targetUserId];
      }

      await updateDoc(carRef, { sharedUsers: updatedSharedUsers });

      console.log("Car shared successfully!");
    } else {
      console.log("Car not found.");
    }
  } catch (error) {
    console.log("Error sharing car:", error);
  }
};



const getCarById = (id, onDataRetrieved) => {
  let car = null;
  if (SIMULATION) {
    car = staticCars.find((c) => c.id === id);
    onDataRetrieved(car);
  } else {
    const carRef = doc(db, "Cars", id);
    const unsubscribe = onSnapshot(carRef, (docSnap) => {
      if (docSnap.exists()) {
        car = { ...docSnap.data(), id: docSnap.id };
      } else {
        car = null;
      }
      onDataRetrieved(car);
    });

    return unsubscribe;
  }
};


const generateNewId = () => {
  return uuidv4();
};

const updateCarData = async (
  carId,
  updatedBrand,
  updatedModel,
  updatedDate,
  updatedPlate,
  updatedKm
) => {
  try {
    if (!carId && carId !== 0) {
      console.log("Invalid carId");
      return;
    }

    if (carId === 0) {
      const newCarId = generateNewId();
      console.log("New car ID:", newCarId);
      const carRef = doc(db, "Cars", newCarId);
      await setDoc(carRef, {
        userId: getCurrentUser().uid,
        brand: updatedBrand,
        model: updatedModel,
        plateDate: updatedDate ? updatedDate.toLocaleDateString("en-US") : null,
        plate: updatedPlate ? updatedPlate.toUpperCase() : null,
        km: typeof updatedKm === "number" ? updatedKm : null,
      });
    } else {
      const carRef = doc(db, "Cars", carId);
      const docSnap = await getDoc(carRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        await updateDoc(carRef, {
          brand: updatedBrand || existingData.brand,
          model: updatedModel || existingData.model,
          plateDate: updatedDate
            ? updatedDate.toLocaleDateString("en-US")
            : existingData.plateDate,
          plate: updatedPlate
            ? updatedPlate.toUpperCase()
            : existingData.plate,
          km: typeof updatedKm === "number" ? updatedKm : existingData.km,
        });

        console.log("Data updated in Firebase");
      } else {
        console.log("Car data not found");
      }
    }
  } catch (error) {
    console.log("Error updating data in Firebase:", error);
  }
};



const deleteSharedCarAsync = async (carId) => {
  const currentUserUid = getCurrentUser().uid;

  try {
    const carRef = doc(db, "Cars", carId);
    const carDoc = await getDoc(carRef);

    if (carDoc.exists()) {
      const carData = carDoc.data();

      if (carData.sharedUsers) {
        const updatedSharedUsers = carData.sharedUsers.filter(uid => uid !== currentUserUid);
        carData.sharedUsers = updatedSharedUsers;

        await updateDoc(carRef, { sharedUsers: updatedSharedUsers });
      }
    }

    console.log("Shared user deleted successfully");
  } catch (error) {
    console.error("Error deleting shared user:", error);
  }
};



const handleDeleteCar = async (carId) => {
  try {
    await deleteDoc(doc(db, "Cars", carId));
    console.log("Car deleted successfully");
    navigation.navigate("HomePage");
  } catch (error) {
    console.log("Error deleting Cars:", error);
  }
};


const getSharedCarAsync = async (onDataRetrieved) => {
  try {
    const currentUserUuid = getCurrentUser().uid;
    let sharedCars = [];

    const querySnapshot = await getDocs(
      query(collection(db, "Cars"), where("sharedUsers", "array-contains", currentUserUuid))
    );
    querySnapshot.forEach((doc) => {
      sharedCars.push({ ...doc.data(), id: doc.id });
    });

    sharedCars = sharedCars.map((car) => ({ ...car, isShared: true }));
    onDataRetrieved(sharedCars);
  } catch (error) {
    console.log("Error retrieving shared cars:", error);
  }
};


const getHistoryAsync = async (carId, onDataRetrieved) => {
  let history = [];
  if (SIMULATION) {
    history = staticHistory;
    onDataRetrieved(history);
  } else {
    try {
      const historyRef = collection(db, "Maintenances");
      const querySnapshot = await getDocs(query(historyRef, where("carId", "==", carId)));

      querySnapshot.forEach((doc) => {
        history.push({ ...doc.data(), id: doc.id });
      });

      onDataRetrieved(history);
    } catch (error) {
      console.log("Error retrieving history:", error);
    }
  }
};


const getMaintenancesByIdAsync = (id, onDataRetrieved) => {
  try {
    const maintenanceRef = doc(db, "Maintenances", id);

    const unsubscribe = onSnapshot(maintenanceRef, (docSnap) => {
      let maintenance = null;
      if (docSnap.exists()) {
        maintenance = { ...docSnap.data(), id: docSnap.id };
      }
      onDataRetrieved(maintenance);
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error retrieving maintenance:", error);
    return null; // Return null in case of an error
  }
};


const getHistoryCalendarAsync = (userId, onDataRetrieved) => {
  try {
    let history = [];
    const maintenancesRef = collection(db, "Maintenances");
    const q = query(maintenancesRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      history = [];
      querySnapshot.forEach((doc) => {
        history.push({ ...doc.data(), id: doc.id });
      });
      onDataRetrieved(history);
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error retrieving history:", error);
    return null; // Return null in case of an error
  }
};

const updateMaintenance = async (
  maintenanceId,
  newDate,
  newComponent,
  carId,
  userId,
  carKm
) => {
  try {
    if (maintenanceId === 0) {
      const newMaintenanceId = generateNewId();
      console.log("New maintenance ID:", newMaintenanceId);

      const maintenanceRef = doc(db, "Maintenances", newMaintenanceId);
      await setDoc(maintenanceRef, {
        date: newDate.toLocaleDateString("en-US"),
        component: newComponent,
        carId: carId,
        userId: userId,
        km: carKm,
      });

      console.log("New maintenance added in Firebase");
    } else {
      if (!maintenanceId) {
        console.log("Invalid maintenanceId");
        return;
      }

      const maintenanceRef = doc(db, "Maintenances", maintenanceId);
      const docSnap = await getDoc(maintenanceRef);

      if (docSnap.exists()) {
        await updateDoc(maintenanceRef, {
          date: newDate.toLocaleDateString("en-US") || docSnap.data().date,
          component: newComponent || docSnap.data().component,
        });

        console.log("Maintenance updated in Firebase");
      } else {
        console.log("Maintenance data not found");
      }
    }
  } catch (error) {
    console.log("Error updating maintenance in Firebase:", error);
  }
};

const handleDeleteMaintenance = async (managId) => {
  try {
    await deleteDoc(doc(db, "Maintenances", managId));
    console.log("Maintenance deleted");
  } catch (error) {
    console.log("Error deleting Maintenance:", error);
  }
};


//Admin

//Model
const getModelAsync = (onDataRetrieved) => {
  try {
    const modelRef = collection(db, "Models");

    const unsubscribe = onSnapshot(modelRef, (querySnapshot) => {
      let models = [];
      querySnapshot.forEach((doc) => {
        models.push({ ...doc.data(), id: doc.id });
      });
      onDataRetrieved(models);
    });

    return unsubscribe; 
  } catch (error) {
    console.log("Error retrieving models:", error);
  }
};

const getModelByIdAsync = (id, onDataRetrieved) => {
  try {
    const modelRef = doc(db, "Models", id);

    const unsubscribe = onSnapshot(modelRef, (docSnap) => {
      let model = null;
      if (docSnap.exists()) {
        model = { ...docSnap.data(), id: docSnap.id };
      }
      onDataRetrieved(model);
    });

    return unsubscribe; 
  } catch (error) {
    console.log("Error retrieving model:", error);
  }
};


const updateModel = async (modelId, updatedBrand, updatedModel) => {
  try {
    if (!modelId && modelId !== 0) {
      console.log("Invalid modelId");
      return;
    }

    if (modelId === 0) {
      const newModelId = generateNewId();
      console.log("New Model ID:", newModelId);
      const componentRef = doc(db, "Models", newModelId);
      await setDoc(componentRef, {
        brand: updatedBrand,
        model: updatedModel,
      });

      console.log("New Model added in Firebase successfully");
    } else {
      const componentRef = doc(db, "Models", modelId);
      const docSnap = await getDoc(componentRef);

      if (docSnap.exists()) {
        await setDoc(componentRef, {
          brand: updatedBrand || docSnap.data().brand,
          model: updatedModel || docSnap.data().model,
        });

        console.log("Data updated in Firebase successfully");
      } else {
        console.log("Model data not found");
      }
    }
  } catch (error) {
    console.log("Error updating data in Firebase:", error);
  }
};

const handleDeleteModel = async (modelId) => {
  try {
    await deleteDoc(doc(db, "Models", modelId));
    console.log("Model deleted successfully");
    navigation.navigate("Models");
  } catch (error) {
    console.log("Error deleting Model:", error);
  }
};

//Components
const getComponentAsync = (onDataRetrieved) => {
  try {
    const componentRef = collection(db, "Components");

    const unsubscribe = onSnapshot(componentRef, (querySnapshot) => {
      let components = [];
      querySnapshot.forEach((doc) => {
        components.push({ ...doc.data(), id: doc.id });
      });
      onDataRetrieved(components);
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error retrieving components:", error);
  }
};

const getComponentByIdAsync = (id, onDataRetrieved) => {
  try {
    const componentRef = doc(db, "Components", id);

    const unsubscribe = onSnapshot(componentRef, (docSnap) => {
      let component = null;
      if (docSnap.exists()) {
        component = { ...docSnap.data(), id: docSnap.id };
      }
      onDataRetrieved(component);
    });

    return unsubscribe; 
  } catch (error) {
    console.log("Error retrieving component:", error);
  }
};


const updateComponent = async (componentId, updatedName, updatedPeriocity) => {
  try {
    if (!componentId && componentId !== 0) {
      console.log("Invalid componentId");
      return;
    }

    if (componentId === 0) {
      const newComponentId = generateNewId();
      console.log("New Component ID:", newComponentId);
      const componentRef = doc(db, "Components", newComponentId);
      await setDoc(componentRef, {
        name: updatedName,
        periodicity: updatedPeriocity,
      });

      console.log("New Component added in Firebase successfully");
    } else {
      const componentRef = doc(db, "Components", componentId);
      const docSnap = await getDoc(componentRef);

      if (docSnap.exists()) {
        await setDoc(componentRef, {
          name: updatedName || docSnap.data().name,
          periodicity: updatedPeriocity || docSnap.data().periodicity,
        });

        console.log("Data updated in Firebase successfully");
      } else {
        console.log("Component data not found");
      }
    }
  } catch (error) {
    console.log("Error updating data in Firebase:", error);
  }
};

const handleDeleteComponent = async (componentId) => {
  try {
    await deleteDoc(doc(db, "Components", componentId));
    console.log("Component deleted successfully");
    navigation.navigate("Components");
  } catch (error) {
    console.log("Error deleting Component:", error);
  }
};

//Users
const registerUserAsync = async (
  email,
  password,
  username,
  firstName,
  lastName,
  birthday,
  streetName,
  city,
  zipCode,
  onError
) => {
  const admin = 0;
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res !== null) {
      const userRef = doc(db, "Users", res.user.uid);

      await setDoc(userRef, {
        username,
        email,
        firstName,
        lastName,
        birthday,
        streetName,
        city,
        zipCode,
        admin
      });

      console.log("User document created successfully!");
      console.log("Document ID:", userRef.id);
    }
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === "auth/email-already-in-use") {
      onError("The email address is already in use. Please use a different email.");
    } else {
      onError("An error occurred during user registration.");
    }
  }
};


const loginUserAsync = async (data, onError) => {
  try{
  const [email, password] = data;
  await signInWithEmailAndPassword(auth, email, password);
}catch(error){
  onError(error.code);
}
};

const getCurrentUser = _ => {
  return auth.currentUser;
}

const logoutUserAsync = async () => {
  await signOut(auth);
  console.log('signout - currentUser', auth.currentUser);
};

const subescribeOnAuthStateChanged = onChanged =>{
  onAuthStateChanged(auth, (userCredential)=>{
    onChanged(userCredential);
  });
}

const getUserAsync = (onDataRetrieved) => {
  try {
    const userRef = collection(db, "Users");

    const unsubscribe = onSnapshot(userRef, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      onDataRetrieved(users);
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error retrieving users:", error);
  }
};

const getUserByIdAsync = (id, onDataRetrieved) => {
  try {
    const userRef = doc(db, "Users", id);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      let user = null;
      if (docSnap.exists()) {
        user = { ...docSnap.data(), id: docSnap.id };
      }
      onDataRetrieved(user);
    });

    return unsubscribe; 
  } catch (error) {
    console.log("Error retrieving user:", error);
  }
};


const updateUser = async (
  userId,
  updatedName,
  updatedEmail,
  updatedFirstName,
  updatedLastName,
  updatedBirthday,
  updatedStreetName,
  updatedCity,
  updatedZipCode,
  updatedPw
) => {
  try {
    if (!userId) {
      console.log("Invalid userId");
      return;
    }

    const userRef = doc(db, "Users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await setDoc(userRef, {
        username: updatedName || docSnap.data().username,
        email: updatedEmail || docSnap.data().email,
        firstName: updatedFirstName || docSnap.data().firstName,
        lastName: updatedLastName || docSnap.data().lastName,
        birthday: updatedBirthday || docSnap.data().birthday,
        streetName: updatedStreetName || docSnap.data().streetName,
        city: updatedCity || docSnap.data().city,
        zipCode: updatedZipCode || docSnap.data().zipCode,
        pw: updatedPw || docSnap.data().pw,
      });

      console.log("Data updated in Firebase successfully");
    } else {
      console.log("User data not found");
    }
  } catch (error) {
    console.log("Error updating data in Firebase:", error);
  }
};

const handleDeleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "Users", userId));
    console.log("Brand deleted successfully");
    navigation.navigate("Users");
  } catch (error) {
    console.log("Error deleting User:", error);
  }
};

//Brand
const getBrandAsync = (onDataRetrieved) => {
  try {
    const brandRef = collection(db, "Brands");

    const unsubscribe = onSnapshot(brandRef, (querySnapshot) => {
      let brands = [];
      querySnapshot.forEach((doc) => {
        brands.push({ ...doc.data(), id: doc.id });
      });
      onDataRetrieved(brands);
    });

    return unsubscribe; 
  } catch (error) {
    console.log("Error retrieving brands:", error);
  }
};

const getBrandByIdAsync = (id, onDataRetrieved) => {
  try {
    const brandRef = doc(db, "Brands", id);

    const unsubscribe = onSnapshot(brandRef, (docSnap) => {
      let brand = null;
      if (docSnap.exists()) {
        brand = { ...docSnap.data(), id: docSnap.id };
      }
      onDataRetrieved(brand);
    });

    return unsubscribe; 
  } catch (error) {
    console.log("Error retrieving brand:", error);
  }
};


const updateBrand = async (brandId, updatedName) => {
  try {
    if (!brandId && brandId !== 0) {
      console.log("Invalid brandId");
      return;
    }

    if (brandId === 0) {
      const newBrandId = generateNewId();
      console.log("New brand ID:", newBrandId);
      const brandRef = doc(db, "Brands", newBrandId);
      await setDoc(brandRef, {
        brand: updatedName,
      });

      console.log("New Brand added in Firebase successfully");
    } else {
      const brandRef = doc(db, "Brands", brandId);
      const docSnap = await getDoc(brandRef);

      if (docSnap.exists()) {
        await setDoc(brandRef, {
          brand: updatedName || docSnap.data().brand,
        });

        console.log("Data updated in Firebase successfully");
      } else {
        console.log("Brand data not found");
      }
    }
  } catch (error) {
    console.log("Error updating data in Firebase:", error);
  }
};

const handleDeleteBrand = async (brandId) => {
  try {
    await deleteDoc(doc(db, "Brands", brandId));
    console.log("Brand deleted successfully");
    navigation.navigate("Brands");
  } catch (error) {
    console.log("Error deleting Brand:", error);
  }
};

//City
const getCityAsync = (onDataRetrieved) => {
  try {
    const query = collection(db, "Cities");
    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push({ ...doc.data(), id: doc.id });
      });
      onDataRetrieved(cities);
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error retrieving cities:", error);
  }
};

const getCityByIdAsync = (id, onDataRetrieved) => {
  try {
    const cityRef = doc(db, "Cities", id);
    const unsubscribe = onSnapshot(cityRef, (docSnapshot) => {
      let city = null;
      if (docSnapshot.exists()) {
        city = { ...docSnapshot.data(), id: docSnapshot.id };
      }
      onDataRetrieved(city);
    });

    return unsubscribe;
  } catch (error) {
    console.log("Error retrieving city:", error);
  }
};

const updateCity = async (cityId, updatedName) => {
  try {
    if (!cityId && cityId !== 0) {
      console.log("Invalid cityId");
      return;
    }

    if (cityId === 0) {
      const newCityId = generateNewId();
      console.log("New city ID:", newCityId);
      const cityRef = doc(db, "Cities", newCityId);
      await setDoc(cityRef, {
        name: updatedName,
      });

      console.log("New city added in Firebase successfully");
    } else {
      const cityRef = doc(db, "Cities", cityId);
      const docSnap = await getDoc(cityRef);

      if (docSnap.exists()) {
        await setDoc(cityRef, {
          name: updatedName || docSnap.data().name,
        });

        console.log("Data updated in Firebase successfully");
      } else {
        console.log("City data not found");
      }
    }
  } catch (error) {
    console.log("Error updating data in Firebase:", error);
  }
};

const handleDeleteCity = async (cityId) => {
  try {
    await deleteDoc(doc(db, "Cities", cityId));
    console.log("City deleted successfully");
    navigation.navigate("Cities");
  } catch (error) {
    console.log("Error deleting city:", error);
  }
};

export { getCarAsync };
export { shareCarWithUser };
export { getCarById };
export { deleteSharedCarAsync }
export { updateCarData };
export { handleDeleteCar };
export { getSharedCarAsync };
export { getHistoryAsync };
export { getHistoryCalendarAsync };
export { getMaintenancesByIdAsync };
export { updateMaintenance };
export { handleDeleteMaintenance };
//Admin
//Model
export { getModelAsync };
export { getModelByIdAsync };
export { updateModel };
export { handleDeleteModel };

//Components
export { getComponentAsync };
export { getComponentByIdAsync };
export { updateComponent };
export { handleDeleteComponent };

//Users
export { registerUserAsync };
export { loginUserAsync };
export { logoutUserAsync };
export { subescribeOnAuthStateChanged };
export {getCurrentUser};
export { getUserAsync };
export { getUserByIdAsync };
export { updateUser };
export { handleDeleteUser };
//Brand
export { getBrandAsync };
export { getBrandByIdAsync };
export { updateBrand };
export { handleDeleteBrand };
//City
export { getCityAsync };
export { getCityByIdAsync };
export { updateCity };
export { handleDeleteCity };
