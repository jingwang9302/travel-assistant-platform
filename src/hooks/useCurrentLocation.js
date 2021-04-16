import { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

const useCurrentLocation = (isNavigating) => {
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
    // console.log(location);
    setCurrentLocation(location.coords);
    setLoading(false);

    return () => {
      console.log("Location granted");
    };
  };

  useEffect(() => {
    let timer = null;
    let mounted = true;
    if (isNavigating) {
      timer = setInterval(() => {
        console.log("timer function");
        getCurrentLocation();
      }, 5000);
    } else {
      getCurrentLocation();
    }
    return () => {
      mounted = false;
      timer && clearInterval(timer);
    };
  }, []);
  return { currentLocation, loading, error };
};

export { useCurrentLocation };
