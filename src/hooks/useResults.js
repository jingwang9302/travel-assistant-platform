import { useState } from "react";
import { config } from "../../config";

export default (currentLocation) => {
  const state = {
    resultList: [],
  };
  const [resultList, setResultList] = useState(state.resultList);
  const [errorMessage, setErrorMessage] = useState("");

  const getSearchResult = (searchTerm) => {
    const latitude = currentLocation.latitude;
    const longitude = currentLocation.longitude;
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    const location = `location=${latitude},${longitude}`;
    const radius = "&radius=2000";
    const type = `&keyword=${searchTerm}`;
    const key = `&key=${config.PLACES_API_KEY}`;
    const searchUrl = url + location + radius + type + key;

    fetch(searchUrl)
      .then((response) => response.json())
      .then((result) => setResultList({ resultList: result }))
      .catch((err) => {
        setErrorMessage("Something went wrong:" + err);
      });
  };

  return [getSearchResult, resultList, errorMessage];
};
