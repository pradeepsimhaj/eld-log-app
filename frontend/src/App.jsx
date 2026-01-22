import { useState } from "react";
import TripForm from "./components/TripForm";
import PaperLog from "./components/PaperLog";
import MapView from "./components/MapView";
import "./app.css";


function App() {
  const [tripResult, setTripResult] = useState(null);

  return (
    <div className="app-container">
      <h1>ELD Log Generator</h1>

      <div className="card">
        <TripForm onResult={setTripResult} />
      </div>

      {tripResult && (
        <>
          <div className="card">
            <h2>Route Map</h2>
            <MapView route={tripResult.route} />
          </div>

          <div className="card">
            <strong>Log Legend</strong>
            <div className="legend">
              <span><div className="legend-box off" /> Off Duty</span>
              <span><div className="legend-box sleep" /> Sleeper</span>
              <span><div className="legend-box drive" /> Driving</span>
              <span><div className="legend-box duty" /> On Duty</span>
            </div>
          </div>

          {tripResult.hos.logs.map((day) => (
            <div key={day.day} className="card paper-log">
              <PaperLog day={day} trip={tripResult.trip} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
