import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;


export const createTrip = async (tripData) => {
  const response = await axios.post(
    `${API_BASE_URL}/trips/`,
    tripData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
