const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => i * 0.25);

const getRowIndex = (type) => {
  switch (type) {
    case "off_duty":
      return 0;
    case "sleeper":
      return 1;
    case "driving":
      return 2;
    case "on_duty":
      return 3;
    default:
      return null;
  }
};

const getColor = (type) => {
  switch (type) {
    case "off_duty":
      return "#90CAF9"; // blue
    case "sleeper":
      return "#CE93D8"; // purple
    case "driving":
      return "#4CAF50"; // green
    case "on_duty":
      return "#FFD54F"; // yellow
    default:
      return "transparent";
  }
};

function PaperLog({ day, trip }) {
  const sleeperHours = day.segments
    .filter((s) => s.type === "sleeper")
    .reduce((sum, s) => sum + (s.end - s.start), 0);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "6px",
      }}
    >
      <h3>Day {day.day}</h3>

      {sleeperHours > 0 && (
        <div style={{ fontSize: "13px", color: "#6a1b9a", marginBottom: "6px" }}>
          Sleeper Berth: {sleeperHours.toFixed(1)} hrs
        </div>
      )}

      {/* Time Header */}
      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(96, 1fr)" }}>
        <div></div>
        {TIME_SLOTS.map((slot) =>
          slot % 1 === 0 ? (
            <div
              key={slot}
              style={{ fontSize: "9px", textAlign: "center" }}
            >
              {slot}
            </div>
          ) : (
            <div key={slot}></div>
          )
        )}
      </div>

      {/* Rows */}
      {["Off Duty", "Sleeper", "Driving", "On Duty"].map((label, rowIndex) => (
        <div
          key={label}
          style={{
            display: "grid",
            gridTemplateColumns: "60px repeat(96, 1fr)",
          }}
        >
          <div style={{ fontSize: "12px" }}>{label}</div>

          {TIME_SLOTS.map((slot) => {
            const segmentHere = day.segments.find(
              (s) =>
                getRowIndex(s.type) === rowIndex &&
                slot >= s.start &&
                slot < s.end
            );

            return (
              <div
                key={slot}
                style={{
                  height: "16px",
                  border: "1px solid #eee",
                  backgroundColor: segmentHere
                    ? getColor(segmentHere.type)
                    : "transparent",
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Remarks */}
      <div style={{ fontSize: "13px", marginTop: "8px", color: "#555" }}>
        <strong>Remarks:</strong>
        <ul>
          <li>Pickup: {trip.pickup_location}</li>
          <li>Dropoff: {trip.dropoff_location}</li>
          <li>Fuel stop assumed every 1000 miles</li>
        </ul>
      </div>
    </div>
  );
}

export default PaperLog;
