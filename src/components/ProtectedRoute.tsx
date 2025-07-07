import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner text="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
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
          }}>🔒</div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            Acceso Restringido
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            Para acceder a esta aplicación necesitas iniciar sesión con tu cuenta Institucional de la UCACUE. 
            y que un administrador apruebe tu registro.
          </p>
          <button
            onClick={() => window.location.href = 'http://localhost:3001/auth/login/microsoft'}
            style={{
              backgroundColor: '#0078d4',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 23 23" fill="currentColor">
              <path d="M11 11V5.5L11 0H0V11H11Z" fill="#f35325"/>
              <path d="M23 11V5.5L23 0H12V11H23Z" fill="#81bc06"/>
              <path d="M11 23V17.5L11 12H0V23H11Z" fill="#05a6f0"/>
              <path d="M23 23V17.5L23 12H12V23H23Z" fill="#ffba08"/>
            </svg>
            Iniciar sesión con Correo Institucional
          </button>
        </div>
      </div>
    );
  }

  if (user?.estado === 'pendiente') {
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
          }}>⏳</div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            Pendiente de Aprobación
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            Tu registro ha sido recibido exitosamente. Un administrador debe aprobar 
            tu cuenta antes de que puedas acceder a la aplicación, cuando llegue el correo de acceso aprobado vuelve a intentar.
          </p>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              <strong>Usuario:</strong> {user.nombre} {user.apellidos}<br/>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Actualizar Estado
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              window.location.reload();
            }}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (user?.estado === 'rechazado') {
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
            Acceso Denegado
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            Tu solicitud de acceso ha sido rechazada por un administrador. 
            Si crees que esto es un error, contacta al administrador del sistema jdatosanalitica@ucacue.edu.ec.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              window.location.reload();
            }}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && user?.rol !== 'admin') {
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
          }}>🔐</div>
          <h2 style={{ 
            color: '#dc3545', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            Permisos Insuficientes
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            Esta sección requiere permisos de administrador.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
