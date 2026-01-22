import axios from "axios";

export const geocodeLocation = async (place) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: place,
        format: "json",
        limit: 1,
      },
    }
  );

  if (!response.data.length) {
    throw new Error(`Location not found: ${place}`);
  }

  return [
    parseFloat(response.data[0].lat),
    parseFloat(response.data[0].lon),
  ];
};
