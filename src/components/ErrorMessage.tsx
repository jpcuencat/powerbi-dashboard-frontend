import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  console.log('ErrorMessage rendered with message:', message);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      backgroundColor: 'white',
      border: '2px solid red',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <div style={{
        color: '#dc3545',
        marginBottom: '16px',
        fontSize: '48px'
      }}>
        ⚠️
      </div>
      
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        Error
      </h3>
      
      <p style={{
        color: '#666',
        textAlign: 'center',
        marginBottom: '24px',
        maxWidth: '400px'
      }}>
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
