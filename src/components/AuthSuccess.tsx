import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AuthSuccess: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Obtener token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setError('No se encontró el token de autenticación');
          return;
        }

        // Guardar token y redirigir
        await login(token);
        
        // Limpiar la URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirigir a la página principal
        window.location.href = '/';
        
      } catch (error) {
        console.error('Error en autenticación:', error);
        setError('Error al procesar la autenticación');
      }
    };

    handleAuthSuccess();
  }, [login]);

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>❌</div>
          <h2 style={{ 
            color: '#dc3545', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            Error de Autenticación
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <LoadingSpinner text="Completando autenticación..." />
        <p style={{ 
          color: '#666', 
          marginTop: '20px',
          fontSize: '14px'
        }}>
          Serás redirigido automáticamente...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
