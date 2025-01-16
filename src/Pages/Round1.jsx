import { useState, useEffect } from "react";
import { getDatabase, ref, set, push, onValue } from "firebase/database";

export default function Round1() {
  const [batch, setBatch] = useState("");
  const [questionNo, setQuestionNo] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAns, setCorrectAns] = useState("");
  const [questionsList, setQuestionsList] = useState([]);

  useEffect(() => {
    if (batch) {
      const db = getDatabase();
      const questionsRef = ref(db, `Question1/${batch}`);

      onValue(questionsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setQuestionsList(Object.values(data));
        } else {
          setQuestionsList([]);
        }
      });
    }
  }, [batch]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !batch ||
      !questionNo ||
      !questionName ||
      !correctAns ||
      options.filter((val) => val).length !== 4
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const db = getDatabase();
      const newQuestionRef = push(ref(db, `Question1/${batch}`));

      await set(newQuestionRef, {
        QuestionNo: questionNo,
        QuestionName: questionName,
        options,
        CorrectAns: correctAns,
      });

      alert("Question is added successfully");
      setQuestionNo("");
      setQuestionName("");
      setOptions(["", "", "", ""]);
      setCorrectAns("");
    } catch (err) {
      console.error(err);
    }
  }

  function updateOptions(e) {
    setOptions((prev) => {
      const newOps = [...prev];
      newOps[e.target.id - 1] = e.target.value;
      return newOps;
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "clamp(1rem, 5vw, 2rem)",
        fontFamily: "'Poppins', sans-serif",
        backgroundImage: "linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)",
        color: "#2e7d32",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: "bold",
          marginBottom: "clamp(1rem, 3vw, 2rem)",
          textAlign: "center",
          color: "#2e7d32",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Round 1: Add Questions by Batch
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Batch Name:</label>
          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
            placeholder="Enter Batch Name"
            style={{
              padding: "0.5rem",
              width: "100%",
              fontSize: "clamp(14px, 3vw, 16px)",
              border: "1px solid #4caf50",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Question No:</label>
          <input
            type="number"
            value={questionNo}
            onChange={(e) => setQuestionNo(e.target.value)}
            required
            placeholder="Enter Question No"
            style={{
              padding: "0.5rem",
              width: "100%",
              fontSize: "clamp(14px, 3vw, 16px)",
              border: "1px solid #4caf50",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Question Name:</label>
          <input
            type="text"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
            required
            placeholder="Enter Question Name"
            style={{
              padding: "0.5rem",
              width: "100%",
              fontSize: "clamp(14px, 3vw, 16px)",
              border: "1px solid #4caf50",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Options:</label>
          {[1, 2, 3, 4].map((val) => (
            <div key={val} style={{ marginBottom: "0.5rem" }}>
              <input
                type="text"
                id={val.toString()}
                value={options[val - 1]}
                onChange={updateOptions}
                required
                placeholder={`Option ${val}`}
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  border: "1px solid #4caf50",
                  borderRadius: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Correct Answer:</label>
          <input
            type="text"
            value={correctAns}
            onChange={(e) => setCorrectAns(e.target.value)}
            required
            placeholder="Enter Correct Answer"
            style={{
              padding: "0.5rem",
              width: "100%",
              fontSize: "clamp(14px, 3vw, 16px)",
              border: "1px solid #4caf50",
              borderRadius: "5px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "clamp(0.5rem, 2vw, 0.7rem) clamp(1rem, 3vw, 1.5rem)",
            fontSize: "clamp(16px, 3vw, 18px)",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#45a049")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#4caf50")
          }
        >
          Save Question
        </button>
      </form>

      {/* Display Section */}
      <div>
        <h2 style={{ fontWeight: "bold", marginTop: "1rem" }}>
          Questions List for Batch: {batch || "N/A"}
        </h2>
        {questionsList.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          questionsList.map((q, index) => (
            <div
              key={index}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                border: "1px solid #4caf50",
              }}
            >
              <h3>
                {q.QuestionNo}: {q.QuestionName}
              </h3>
              <p>Options: {q.options}</p>
              <p>Correct Answer: {q.CorrectAns}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
