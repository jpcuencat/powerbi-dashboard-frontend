import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Cargando...' 
}) => {
  console.log('LoadingSpinner rendered with text:', text);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '32px',
      backgroundColor: 'white',
      border: '2px solid blue',
      margin: '20px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 2s linear infinite'
      }}></div>
      <p style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>{text}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
