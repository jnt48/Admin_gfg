import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, set } from "firebase/database";

export default function Round2() {
  const [teamLeader, setTeamLeader] = useState("");
  const [points, setPoints] = useState("");
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const db = getDatabase();
        const teamsRef = ref(db, "teams");
        const snapshot = await get(teamsRef);

        if (snapshot.exists()) {
          const teamsData = snapshot.val();
          setTeamLeadersList(Object.values(teamsData));
        } else {
          alert("No teams found in the database.");
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        alert("An error occurred while fetching teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamLeader || !points) {
      alert("Please select a team leader and enter points.");
      return;
    }

    if (isNaN(points) || Number(points) < 0) {
      alert("Points must be a positive numeric value.");
      return;
    }

    try {
      setSubmitting(true);
      const db = getDatabase();

      const teamRef = ref(db, `teams/${teamLeader}`);
      const snapshot = await get(teamRef);

      if (snapshot.exists()) {
        const teamData = snapshot.val();
        const updatedOverall = (teamData.overall || 0) + Number(points);

        await set(teamRef, {
          ...teamData,
          round2: Number(points),
          overall: updatedOverall,
        });

        alert("Points submitted successfully!");
        setTeamLeader("");
        setPoints("");
      } else {
        alert("Team not found in the database.");
      }
    } catch (error) {
      alert("Failed to submit points.");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f0fff4, #c6f6d5)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#38a169",
            color: "white",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Submit Team Leader Points
          </h2>
        </div>
        <div style={{ padding: "1rem" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#718096" }}>
              Loading team leaders...
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="teamLeader"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                  }}
                >
                  Team Leader:
                </label>
                <select
                  id="teamLeader"
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    color: "#4a5568",
                    border: "1px solid #e2e8f0",
                    borderRadius: "5px",
                  }}
                >
                  <option value="">Select a team leader</option>
                  {teamLeadersList.map((leader, index) => (
                    <option key={index} value={leader.uid}>
                      {leader.teamName} ({leader.leaderEmail})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="points"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                  }}
                >
                  Points:
                </label>
                <input
                  type="number"
                  id="points"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                  style={{
                    width: "95%",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0.5rem 0.8rem",
                    color: "#4a5568",
                    border: "1px solid #e2e8f0",
                    borderRadius: "5px",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: submitting ? "#9ae6b4" : "#38a169",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                {submitting ? "Submitting..." : "Submit Points"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
