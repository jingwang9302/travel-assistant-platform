import { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setError("Permission not granted");
      setLoading(false);
      setCurrentLocation(null);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setCurrentLocation(location.coords);
    setLoading(false);

    return () => {
      console.log("Location granted");
    };
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { currentLocation, loading, error };
};

export { useCurrentLocation };
