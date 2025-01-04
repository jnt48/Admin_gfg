import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4'];
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#e8f5e9',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Poppins', sans-serif",
      backgroundImage: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <h1 style={{
        marginTop: '5vh',
        fontSize: 'clamp(36px, 8vw, 64px)',
        fontWeight: 'bold',
        color: '#2e7d32',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        GFG 💚
      </h1>
      
      <h2 style={{
        fontSize: 'clamp(24px, 6vw, 48px)',
        fontWeight: 'bold',
        color: '#388e3c',
        marginTop: '2vh',
        marginBottom: '5vh',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        Admin Panel
      </h2>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(10px, 3vw, 25px)',
        flexWrap: 'wrap',
        maxWidth: '100%',
      }}>
        {rounds.map((round, index) => (
          <button
            key={index}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              width: 'clamp(140px, 40vw, 180px)',
              height: 'clamp(140px, 40vw, 180px)',
              fontSize: 'clamp(18px, 4vw, 24px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textTransform: 'uppercase',
              margin: '10px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.2)';
              e.currentTarget.style.backgroundColor = '#45a049';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.backgroundColor = '#4caf50';
            }}
            onClick={() => navigate(`/round/${index+1}`)}
          >
            <span style={{ fontSize: 'clamp(24px, 6vw, 36px)', marginBottom: '10px' }}>{index + 1}</span>
            <span>{round}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

