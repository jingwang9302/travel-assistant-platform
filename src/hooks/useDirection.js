import { useState } from "react";
import { config } from "../../config";
import Polyline from "@mapbox/polyline";

export default () => {
  const [navigationInfo, setNavigationInfo] = useState(null);

  const getDirections = async (startLoc, desLoc) => {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${config.DIRECTION_API_KEY}`
      );
      const respJson = await resp.json();
      const response = respJson.routes[0];
      const distanceTime = response.legs[0];
      const distance = distanceTime.distance.text;
      const time = distanceTime.duration.text;
      const points = Polyline.decode(
        respJson.routes[0].overview_polyline.points
      );
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      setNavigationInfo({ coords, distance, time });
      // console.log(navigationInfo);
      //   console.log(coords);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return { navigationInfo, getDirections };
};
