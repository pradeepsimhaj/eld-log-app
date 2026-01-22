import { useState } from "react";
import { createTrip } from "../api/trips";
import { geocodeLocation } from "../api/geocode";

function TripForm({ onResult }) {
  const [formData, setFormData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: "",
  });

  const [useSleeper, setUseSleeper] = useState(false);
  const [estimatedTripHours, setEstimatedTripHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const estimateTripHours = () => {
    if (
      formData.current_location &&
      formData.pickup_location &&
      formData.dropoff_location
    ) {
      return 12;
    }
    return 0;
  };

  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updated);

    const estimate = estimateTripHours();
    setEstimatedTripHours(estimate);

    if (estimate < 7) {
      setUseSleeper(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [current, pickup, dropoff] = await Promise.all([
        geocodeLocation(formData.current_location),
        geocodeLocation(formData.pickup_location),
        geocodeLocation(formData.dropoff_location),
      ]);

      const result = await createTrip({
        ...formData,
        current_cycle_used: Number(formData.current_cycle_used),
        use_sleeper: useSleeper,
      });

      onResult({
        ...result,
        route: { current, pickup, dropoff },
      });
    } catch (err) {
      setError(err.message || "Failed to generate logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <h2>Trip Details</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <input name="current_location" placeholder="Current Location" onChange={handleChange} required />
        <input name="pickup_location" placeholder="Pickup Location" onChange={handleChange} required />
        <input name="dropoff_location" placeholder="Dropoff Location" onChange={handleChange} required />
        <input type="number" name="current_cycle_used" placeholder="Cycle Used (hrs)" min="0" onChange={handleChange} required />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={useSleeper}
            disabled={estimatedTripHours < 7}
            onChange={(e) => setUseSleeper(e.target.checked)}
          />{" "}
          Driver used Sleeper Berth (≥ 7 hours)
        </label>
      </div>

      <button type="submit" style={{ marginTop: 12 }} disabled={loading}>
        {loading ? "Calculating..." : "Generate Logs"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default TripForm;
