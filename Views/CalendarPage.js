import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Calendar } from "react-native-calendars";
import { getHistoryCalendarAsync, getCurrentUser } from "../services";
export default function CalendarPageView({ navigation }) {
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    getHistoryCalendarAsync(getCurrentUser()?.uid, (data) => {
      setCalendar(data);
    });
  
    return () => {
    };
  }, []);
  
  
  const createMarkedDates = (calendarData) => {
    const markedDates = {};
    const today = new Date();
  
    calendarData.forEach((item) => {
      const { date } = item;
      const formattedDate = formatDate(date);
      const currentDate = new Date(formattedDate);
  
      const diffInDays = Math.ceil(
        (currentDate - today) / (1000 * 60 * 60 * 24)
      );
  
      let color = "red";
  
      if (diffInDays >= 10) {
        color = "orange";
      }
  
      if (diffInDays < 0) {
        color = "black";
      }
  
      markedDates[formattedDate] = {
        customStyles: {
          container: { backgroundColor: color },
          text: { color: "white" },
        },
      };
    });
  
    return markedDates;
  };
  
  

  const formatDate = (date) => {
    const parts = date.split("/");
    const year = parseInt(parts[2]);
    const month = parseInt(parts[0]);
    const day = parseInt(parts[1]);
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    return formattedDate;
  };

  const markedDates = createMarkedDates(calendar);

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar
          style={{
            height: 350,
            position: "relative",
            backgroundColor: "transparent",
            calendarBackground: "transparent",
          }}
          markingType="custom"
          markedDates={markedDates}
        />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#E37D00",
  },
  calendar: {
    marginTop: "10%",
    zIndex: -1,
  },
});
