import React, { useEffect, useState } from "react";
import Card2 from "../Components/cardIsActive";
import Leaderboard from "../Components/LeaderBoard";
import { getDatabase, ref, set, onValue, push, get } from "firebase/database";
import { useFirebase } from "../firebase";

function Round4() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [lightState, setLightState] = useState("green");
  const [newQuestion, setNewQuestion] = useState("");
  const [newSolution, setNewSolution] = useState("");
  const firebase = useFirebase();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://polaris-5c2b4-default-rtdb.firebaseio.com/Question4.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        if (data) {
          const questionList = Object.entries(data).map(([id, question]) => ({
            id,
            ...question,
          }));
          setQuestions(questionList);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching questions:", err);
      }
    }

    fetchQuestions();

    // Set up listener for light state
    const db = getDatabase(firebase.app);
    const lightRef = ref(db, 'lightState');
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
      const lightRef = ref(db, 'lightState');
      await set(lightRef, {
        current: newState,
        timestamp: Date.now()
      });
      setLightState(newState);
    } catch (err) {
      console.error("Error toggling light:", err);
      setError("Failed to toggle light state");
    }
  };

  const addNewQuestion = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase(firebase.app);
      const questionsRef = ref(db, 'Question4');
      const newQuestionRef = push(questionsRef);
      await set(newQuestionRef, {
        name: newQuestion,
        solution: newSolution,
        isActive: false
      });
      setNewQuestion("");
      setNewSolution("");
      // Refresh questions
      const updatedQuestionsSnapshot = await get(questionsRef);
      const updatedQuestionsData = updatedQuestionsSnapshot.val();
      if (updatedQuestionsData) {
        const updatedQuestionList = Object.entries(updatedQuestionsData).map(([id, question]) => ({
          id,
          ...question,
        }));
        setQuestions(updatedQuestionList);
      }
    } catch (err) {
      console.error("Error adding new question:", err);
      setError("Failed to add new question");
    }
  };

  const LightControl = () => (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      justifyContent: 'center', 
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: lightState === 'green' ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => toggleLight('green')}
      >
        Green Light
      </button>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: lightState === 'red' ? '#dc3545' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => toggleLight('red')}
      >
        Red Light
      </button>
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Current State: <strong>{lightState.toUpperCase()}</strong>
      </div>
    </div>
  );

  const AddQuestionForm = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <form onSubmit={addNewQuestion} style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h3 style={{
          marginBottom: '20px',
          textAlign: 'center',
          color: '#333',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>Add New Coding Question</h3>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="question" style={{
            display: 'block',
            marginBottom: '5px',
            color: '#555',
            fontSize: '14px'
          }}>Question:</label>
          <textarea
            id="question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter coding question here..."
            style={{
              width: '100%',
              height: '150px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f8f8f8',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="solution" style={{
            display: 'block',
            marginBottom: '5px',
            color: '#555',
            fontSize: '14px'
          }}>Solution:</label>
          <textarea
            id="solution"
            value={newSolution}
            onChange={(e) => setNewSolution(e.target.value)}
            placeholder="Enter solution code here..."
            style={{
              width: '100%',
              height: '200px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#f8f8f8',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
            required
          />
        </div>
        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Add Question
        </button>
      </form>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
            Admin Dashboard
          </h1>
          <button
            style={{
              padding: "10px 20px",
              marginBottom: "20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("User signed out");
            }}
          >
            Log Out
          </button>
          
          <LightControl />

          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Questions</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px"
            }}
          >
            {questions.map((question) => (
              
              <Card2
                key={question.id}
                name={`${question.name} (Active: ${
                  question.isActive ? "Yes" : "No"
                })`}
                id={question.id}
                isActive={question.isActive}
              />
            ))}
          </div>

          <AddQuestionForm />

          <Leaderboard />
        </>
      )}
    </div>
  );
}

export default Round4;

