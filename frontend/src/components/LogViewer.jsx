function getColor(type) {
  switch (type) {
    case "driving":
      return "#4CAF50";
    case "on_duty":
      return "#FFC107";
    case "off_duty":
      return "#90CAF9";
    case "break":
      return "#FF7043";
    default:
      return "#E0E0E0";
  }
}

function LogViewer({ logs }) {
  return (
    <div>
      <h2>Daily Logs</h2>

      {logs.map((day) => (
        <div key={day.day} style={{ marginBottom: 30 }}>
          <h3>Day {day.day}</h3>

          <div
            style={{
              display: "flex",
              height: 40,
              border: "1px solid #ccc",
            }}
          >
            {day.segments.map((seg, index) => {
              const widthPercent = ((seg.end - seg.start) / 24) * 100;

              return (
                <div
                  key={index}
                  title={`${seg.type} (${seg.start} - ${seg.end})`}
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: getColor(seg.type),
                    height: "100%",
                  }}
                />
              );
            })}
          </div>

          <div style={{ fontSize: 12, marginTop: 5 }}>
            {day.segments.map((seg, index) => (
              <span key={index} style={{ marginRight: 10 }}>
                {seg.type}: {seg.start}–{seg.end}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LogViewer;
