import React, { useEffect, useState } from "react";
import Card2 from "../Components/cardIsActive";
import Leaderboard from "../Components/LeaderBoard";
import { getDatabase, ref, set, onValue, push, get } from "firebase/database";
import { useFirebase } from "../firebase";

function Round4() {
  const [questions, setQuestions] = useState({ Batch1: [], Batch2: [] });
  const [error, setError] = useState(null);
  const [lightState, setLightState] = useState("green");
  const [newSolution, setNewSolution] = useState("");
  const [questionNumber, setQuestionNumber] = useState("");
  const [batchNo, setBatchNo] = useState("Batch1");
  const [fileContent, setFileContent] = useState(""); // Store file content
  const firebase = useFirebase();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const db = getDatabase(firebase.app);
        const batch1Ref = ref(db, "Question4/Batch1");
        const batch2Ref = ref(db, "Question4/Batch2");

        const [batch1Snapshot, batch2Snapshot] = await Promise.all([
          get(batch1Ref),
          get(batch2Ref),
        ]);

        const batch1Data = batch1Snapshot.val() || {};
        const batch2Data = batch2Snapshot.val() || {};

        setQuestions({
          Batch1: Object.entries(batch1Data).map(([id, question]) => ({
            id,
            ...question,
          })),
          Batch2: Object.entries(batch2Data).map(([id, question]) => ({
            id,
            ...question,
          })),
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching questions:", err);
      }
    }

    fetchQuestions();

    const db = getDatabase(firebase.app);
    const lightRef = ref(db, "lightState");
    onValue(lightRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLightState(data.current);
      }
    });
  }, []);

  const toggleLight = async (newState) => {
    try {
      const db = getDatabase(firebase.app);
      const lightRef = ref(db, "lightState");
      await set(lightRef, {
        current: newState,
        timestamp: Date.now(),
      });
      setLightState(newState);
    } catch (err) {
      console.error("Error toggling light:", err);
      setError("Failed to toggle light state");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read file content");
    };
    reader.readAsText(file);
  };

  const addNewQuestion = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase(firebase.app);
      const questionsRef = ref(db, `Question4/${batchNo}`);
      const newQuestionRef = push(questionsRef);
      await set(newQuestionRef, {
        name: fileContent,
        solution: newSolution,
        isActive: false,
        questionNumber: questionNumber,
      });

      setFileContent("");
      setNewSolution("");
      setQuestionNumber("");
      setBatchNo("Batch1");

      const updatedSnapshot = await get(questionsRef);
      const updatedData = updatedSnapshot.val();
      const updatedQuestionList = Object.entries(updatedData).map(
        ([id, question]) => ({ id, ...question })
      );

      setQuestions((prevState) => ({
        ...prevState,
        [batchNo]: updatedQuestionList,
      }));
    } catch (err) {
      console.error("Error adding new question:", err);
      setError("Failed to add new question");
    }
  };

  const LightControl = () => (
    <div
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      {/* Green Light Button */}
      <button
        style={{
          backgroundColor: lightState === "green" ? "#4CAF50" : "#ccc",
          color: "white",
        }}
        onClick={() => toggleLight("green")}
      >
        Green Light
      </button>
      {/* Red Light Button */}
      <button
        style={{
          backgroundColor: lightState === "red" ? "#dc3545" : "#ccc",
          color: "white",
        }}
        onClick={() => toggleLight("red")}
      >
        Red Light
      </button>
      <div>
        Current State: <strong>{lightState.toUpperCase()}</strong>
      </div>
    </div>
  );

  const AddQuestionForm = () => (
    <form onSubmit={addNewQuestion}>
      {/* Question Number */}
      <input
        type="number"
        value={questionNumber}
        onChange={(e) => setQuestionNumber(e.target.value)}
        placeholder="Question Number"
        required
      />
      {/* Batch Selection */}
      <select value={batchNo} onChange={(e) => setBatchNo(e.target.value)}>
        <option value="Batch1">Batch 1</option>
        <option value="Batch2">Batch 2</option>
      </select>
      {/* File Input for Question */}
      <input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        required
      />
      {/* Solution Text */}
      <textarea
        value={newSolution}
        onChange={(e) => setNewSolution(e.target.value)}
        placeholder="Solution"
        required
      />
      <button type="submit">Add Question</button>
    </form>
  );

  return (
    <div>
      {error && <h1>{error}</h1>}
      <h1>Admin Dashboard</h1>
      <LightControl />
      <h2>Questions for Batch 1</h2>
      <div>
        {/* {questions.Batch1.map((q) => (
          <Card2 key={q.id} {...q} />
        ))} */}
      </div>
      <h2>Questions for Batch 2</h2>
      <div>
        {questions.Batch2.map((q) => (
          <Card2 key={q.id} {...q} />
        ))}
      </div>
      <AddQuestionForm />
      <Leaderboard />
    </div>
  );
}

export default Round4;
