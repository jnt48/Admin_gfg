import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue } from "firebase/database";

export default function Round1() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctOption, setCorrectOption] = useState("");
    const [questionsList, setQuestionsList] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const questionsRef = ref(db, 'Question1');
        
        onValue(questionsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setQuestionsList(Object.values(data));
            } else {
                setQuestionsList([]);
            }
        });
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!question || !correctOption || options.filter(val => val).length !== 4) {
            alert("FILL ALL THE FIELDS");
            return;
        }
        try {
            const db = getDatabase();
            const newQuestionRef = push(ref(db, 'Question1'));

            await set(newQuestionRef, {
                question,
                options,
                correctOption
            });

            alert('Question is added successfully');
            setQuestion("");
            setOptions(["", "", "", ""]);
            setCorrectOption("");
        } catch (err) {
            console.error(err);
        }
    }

    function updateOptions(e) {
        setOptions(prev => {
            const newOps = [...prev];
            newOps[e.target.id - 1] = e.target.value;
            return newOps;
        });
    }

    return (
        <div style={{
            minHeight: '100vh',
            padding: 'clamp(1rem, 5vw, 2rem)',
            fontFamily: "'Poppins', sans-serif",
            backgroundImage: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)',
            color: '#2e7d32',
        }}>
            <h1 style={{
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 'bold',
                marginBottom: 'clamp(1rem, 3vw, 2rem)',
                textAlign: 'center',
                color: '#2e7d32',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            }}>
                Round 1: Add Questions
            </h1>

            {/* Form Section */}
            <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                <div style={{
                    fontWeight: 'bold',
                    marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
                    fontSize: 'clamp(18px, 4vw, 24px)',
                }}>
                    Add Question
                </div>
                <div style={{ marginBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>QUE:</div>
                    <input
                        required
                        type="text"
                        placeholder="Enter Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            width: '100%',
                            fontSize: 'clamp(14px, 3vw, 16px)',
                            border: '1px solid #4caf50',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                    />
                </div>

                <div style={{ marginBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Options:</div>
                    {[1, 2, 3, 4].map((val) => (
                        <div key={val} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: 'clamp(16px, 3vw, 18px)', marginRight: '0.5rem' }}>{val} -</span>
                            <input
                                required
                                type="text"
                                id={val.toString()}
                                placeholder={`Enter Option ${val}`}
                                value={options[val - 1]}
                                onChange={updateOptions}
                                style={{
                                    padding: '0.5rem',
                                    width: '100%',
                                    fontSize: 'clamp(14px, 3vw, 16px)',
                                    border: '1px solid #4caf50',
                                    borderRadius: '5px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Correct Option:</div>
                    <input
                        required
                        type="text"
                        placeholder="Enter Correct Option"
                        value={correctOption}
                        onChange={(e) => setCorrectOption(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            width: '100%',
                            fontSize: 'clamp(14px, 3vw, 16px)',
                            border: '1px solid #4caf50',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        style={{
                            padding: 'clamp(0.5rem, 2vw, 0.7rem) clamp(1rem, 3vw, 1.5rem)',
                            fontSize: 'clamp(16px, 3vw, 18px)',
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
                    >
                        Save Question
                    </button>
                </div>
            </div>

            {/* Display Section */}
            <div style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                <h2 style={{
                    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                    fontWeight: 'bold',
                    fontSize: 'clamp(20px, 4vw, 28px)',
                    color: '#2e7d32',
                }}>
                    Questions List
                </h2>
                {questionsList.length === 0 ? (
                    <p style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>No questions added yet.</p>
                ) : (
                    questionsList.map((q, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #4caf50',
                                borderRadius: '5px',
                                padding: 'clamp(0.8rem, 3vw, 1.2rem)',
                                marginBottom: 'clamp(0.8rem, 3vw, 1.2rem)',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                        >
                            <h3 style={{
                                marginBottom: '0.5rem',
                                fontSize: 'clamp(16px, 3vw, 18px)',
                                color: '#2e7d32',
                            }}>
                                {index + 1}. {q.question}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '0.5rem' }}>
                                {q.options.map((option, idx) => (
                                    <li key={idx} style={{
                                        marginBottom: '0.3rem',
                                        fontSize: 'clamp(14px, 3vw, 16px)',
                                    }}>
                                        {idx + 1}. {option}
                                    </li>
                                ))}
                            </ul>
                            <p style={{
                                fontWeight: 'bold',
                                color: '#4caf50',
                                fontSize: 'clamp(14px, 3vw, 16px)',
                            }}>
                                Correct Answer: {q.correctOption}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

