import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  location,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "f3d5c2469982e773e13c8db08b7e90cb";

const icons = {
  //  "Clear": weather-sunny
};

export default function App() {
  const [city, setCity] = useState("Loding...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const json = await response.json();
    setDays(json);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days?.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            ></ActivityIndicator>
          </View>
        ) : (
          <View style={styles.day}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width:"100%"
              }}
            >
              <Text style={styles.temp}>
                {parseFloat(days.main.temp).toFixed(1)}
              </Text>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={80}
                color="white"
              />
            </View>
            <Text style={styles.description}>{days.weather[0].main}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",

  },
  city: {
    flex: 1.1,
    justifyContent: "center",
    alignItems: "center",

  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "#fff",
  },
  weather: {},

  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 80,
    marginLeft:20,
    color: "#fff",
  },
  description: {
    marginTop: -30,
    fontSize: 50,
    marginRight: 270,
    color: "#fff",

  },
});
