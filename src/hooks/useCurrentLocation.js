import { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";

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

    navigator.geolocation.getCurrentPosition(
      (data) => {
        setCurrentLocation(data.coords);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

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
