import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

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
