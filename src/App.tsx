import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportList from './components/ReportList';
import ReportViewer from './components/ReportViewer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthSuccess from './components/AuthSuccess';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './contexts/AuthContext';

// Definir tipo localmente
interface Report {
  id: number;
  nombre: string;
  Descripcion?: string;
  imagen_url?: string;
}

// Definir estados de la aplicación
type AppView = 'list' | 'viewer';

function App() {
  const { user, logout } = useAuth();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [isTransitioning, setIsTransitioning] = useState(false);

  console.log('App component rendered');
  console.log('Selected report:', selectedReport);
  console.log('Current view:', currentView);
  console.log('Error state:', error);
  console.log('Is transitioning:', isTransitioning);

  const handleReportSelect = useCallback((report: Report) => {
    console.log('Report selected:', report);
    try {
      setIsTransitioning(true);
      setSelectedReport(report);
      setCurrentView('viewer');
      setError(null); // Limpiar errores previos
      
      // Simular una pequeña transición para evitar problemas de renderizado
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    } catch (err) {
      console.error('Error selecting report:', err);
      setError('Error al seleccionar reporte');
      setIsTransitioning(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    console.log('Back button clicked - handleBack function called');
    console.log('Current selectedReport before clearing:', selectedReport);
    try {
      setIsTransitioning(true);
      setCurrentView('list');
      
      // Limpiar el reporte seleccionado después de cambiar la vista
      setTimeout(() => {
        setSelectedReport(null);
        setIsTransitioning(false);
        console.log('Successfully returned to list view');
      }, 50);
    } catch (err) {
      console.error('Error going back:', err);
      setError('Error al regresar');
      setIsTransitioning(false);
    }
  }, [selectedReport]);

  // Effect para debug
  useEffect(() => {
    console.log('App state changed:', {
      selectedReport: selectedReport?.nombre || 'null',
      currentView,
      isTransitioning
    });
  }, [selectedReport, currentView, isTransitioning]);

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f0f0',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          border: '2px solid red',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'red', marginBottom: '20px' }}>Error en la aplicación</h1>
          <p style={{ color: 'black', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setSelectedReport(null);
            }}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading durante transiciones
  if (isTransitioning) {
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
          border: '2px solid #007bff'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Cargando...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Header con información del usuario */}
            <div style={{ 
              padding: '15px 20px', 
              backgroundColor: 'white', 
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h1 style={{ color: 'black', fontSize: '24px', margin: 0 }}>Dashboard de Power BI</h1>
                <p style={{ color: 'gray', margin: '5px 0 0 0' }}>Jefatura de Datos y Analítica</p>
              </div>
              {user && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                        {user.nombre} {user.apellidos}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                        {user.email} • {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {user.rol === 'admin' && (
                        <button
                          onClick={() => window.location.href = '/admin'}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          👑 Admin Panel
                        </button>
                      )}
                      <button
                        onClick={logout}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
              )}
            </div>
            
            {currentView === 'viewer' && selectedReport ? (
              <div style={{ padding: '20px' }}>
                <button 
                  onClick={handleBack}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  ← Volver a la lista
                </button>
                <ReportViewer report={selectedReport} onBack={handleBack} />
              </div>
            ) : (
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{ color: 'black', margin: 0 }}>Lista de Reportes</h2>
                  <div style={{
                    backgroundColor: '#e8f4f8',
                    border: '2px solid #007bff',
                    padding: '8px 12px',
                    borderRadius: '5px'
                  }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#333' }}>
                      Última actualización: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <ReportList 
                  key="report-list-component"
                  onReportSelect={handleReportSelect} 
                />
              </div>
            )}
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App
