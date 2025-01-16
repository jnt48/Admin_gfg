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
  const [batchNo, setBatchNo] = useState(1);
  const [questionName, setQuestionName] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQuestionImage(reader.result);
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewQuestion = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase(firebase.app);
      const batchKey = `Batch${batchNo}`;
      const questionsRef = ref(db, `Question4/${batchKey}`);
      const newQuestionRef = push(questionsRef);

      const imageData = questionImage || null;

      await set(newQuestionRef, {
        name: questionName,
        image: imageData,
        solution: newSolution,
        isActive: false,
        questionNumber: questionNumber,
      });

      setQuestionName("");
      setNewSolution("");
      setQuestionNumber("");
      setBatchNo(1);
      setQuestionImage(null);

      const updatedSnapshot = await get(questionsRef);
      const updatedData = updatedSnapshot.val();
      const updatedQuestionList = Object.entries(updatedData).map(
        ([id, question]) => ({ id, ...question })
      );

      setQuestions((prevState) => ({
        ...prevState,
        [batchKey]: updatedQuestionList,
      }));
    } catch (err) {
      console.error("Error adding new question:", err);
      setError("Failed to add new question");
    }
  };

  const LightControl = () => (
    <div className="flex gap-4 justify-center mb-6">
      <button
        className={`px-4 py-2 rounded-md text-white ${
          lightState === "green" ? "bg-green-500" : "bg-gray-300"
        }`}
        onClick={() => toggleLight("green")}
      >
        Green Light
      </button>
      <button
        className={`px-4 py-2 rounded-md text-white ${
          lightState === "red" ? "bg-red-500" : "bg-gray-300"
        }`}
        onClick={() => toggleLight("red")}
      >
        Red Light
      </button>
      <div className="px-4 py-2 bg-white rounded-md shadow">
        Current State: <strong>{lightState.toUpperCase()}</strong>
      </div>
    </div>
  );

  const AddQuestionForm = () => (
    <form onSubmit={addNewQuestion} className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Question</h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionNumber">
          Question Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="questionNumber"
          type="number"
          value={questionNumber}
          onChange={(e) => setQuestionNumber(e.target.value)}
          placeholder="Enter Question Number"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="batchNo">
          Batch Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="batchNo"
          type="number"
          value={batchNo}
          onChange={(e) => setBatchNo(Number(e.target.value))}
          placeholder="Enter Batch Number"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionName">
          Question Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="questionName"
          type="text"
          value={questionName}
          onChange={(e) => setQuestionName(e.target.value)}
          placeholder="Enter Question Name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionImage">
          Question Image
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="questionImage"
          type="file"
          onChange={handleImageUpload}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="solution">
          Solution
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          id="solution"
          value={newSolution}
          onChange={(e) => setNewSolution(e.target.value)}
          placeholder="Enter Solution"
          required
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add Question
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <h1 className="text-red-500 text-2xl font-bold mb-4">{error}</h1>}
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>
      <LightControl />
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Questions for Batch 1</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {questions.Batch1.map((q) => (
          <Card2 key={q.id} {...q} />
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Questions for Batch 2</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

