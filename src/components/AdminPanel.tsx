import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface User {
  id: number;
  email: string;
  nombre: string;
  apellidos?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  rol: 'usuario' | 'admin';
  fecha_registro: string;
  ultimo_acceso?: string;
}

const AdminPanel: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      setActionLoading(userId);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al aprobar usuario');
      }

      // Actualizar la lista de usuarios
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar usuario');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectUser = async (userId: number) => {
    try {
      setActionLoading(userId);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al rechazar usuario');
      }

      // Actualizar la lista de usuarios
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar usuario');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (userId: number, newRole: 'usuario' | 'admin') => {
    try {
      setActionLoading(userId);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: newRole })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar rol');
      }

      // Actualizar la lista de usuarios
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar rol');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Cargando usuarios..." />;
  }

  // Separar usuarios por estado
  const pendingUsers = users.filter(u => u.estado === 'pendiente');
  const approvedUsers = users.filter(u => u.estado === 'aprobado');
  const rejectedUsers = users.filter(u => u.estado === 'rechazado');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
              Panel de Administración
            </h1>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Gestiona usuarios y permisos del sistema
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
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
            ← Volver a Reportes
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#c33', margin: 0 }}>❌ {error}</p>
          <button
            onClick={() => setError(null)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Usuarios Pendientes */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e67e22', marginBottom: '15px' }}>
          🕐 Usuarios Pendientes de Aprobación ({pendingUsers.length})
        </h2>
        
        {pendingUsers.length === 0 ? (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#666'
          }}>
            No hay usuarios pendientes de aprobación
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {pendingUsers.map(user => (
              <div key={user.id} style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '6px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                      {user.nombre} {user.apellidos}
                    </h3>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      📧 {user.email}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '12px' }}>
                      📅 Registrado: {new Date(user.fecha_registro).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleApproveUser(user.id)}
                      disabled={actionLoading === user.id}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: actionLoading === user.id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === user.id ? 0.6 : 1
                      }}
                    >
                      {actionLoading === user.id ? '⏳' : '✅'} Aprobar
                    </button>
                    <button
                      onClick={() => handleRejectUser(user.id)}
                      disabled={actionLoading === user.id}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: actionLoading === user.id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === user.id ? 0.6 : 1
                      }}
                    >
                      {actionLoading === user.id ? '⏳' : '❌'} Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usuarios Aprobados */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#27ae60', marginBottom: '15px' }}>
          ✅ Usuarios Aprobados ({approvedUsers.length})
        </h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {approvedUsers.map(user => (
            <div key={user.id} style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '6px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                    {user.nombre} {user.apellidos}
                    <span style={{
                      backgroundColor: user.rol === 'admin' ? '#e74c3c' : '#3498db',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      marginLeft: '10px'
                    }}>
                      {user.rol === 'admin' ? '👑 ADMIN' : '👤 USER'}
                    </span>
                  </h3>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    📧 {user.email}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '12px' }}>
                    📅 Registrado: {new Date(user.fecha_registro).toLocaleString()}
                    {user.ultimo_acceso && (
                      <span style={{ marginLeft: '15px' }}>
                        🕐 Último acceso: {new Date(user.ultimo_acceso).toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {user.id !== currentUser?.id && ( // No permitir cambiar rol propio
                    <>
                      <button
                        onClick={() => handleChangeRole(user.id, user.rol === 'admin' ? 'usuario' : 'admin')}
                        disabled={actionLoading === user.id}
                        style={{
                          backgroundColor: user.rol === 'admin' ? '#f39c12' : '#9b59b6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: actionLoading === user.id ? 'not-allowed' : 'pointer',
                          opacity: actionLoading === user.id ? 0.6 : 1
                        }}
                      >
                        {actionLoading === user.id ? '⏳' : (user.rol === 'admin' ? '👤' : '👑')} 
                        {user.rol === 'admin' ? ' Hacer Usuario' : ' Hacer Admin'}
                      </button>
                      <button
                        onClick={() => handleRejectUser(user.id)}
                        disabled={actionLoading === user.id}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: actionLoading === user.id ? 'not-allowed' : 'pointer',
                          opacity: actionLoading === user.id ? 0.6 : 1
                        }}
                      >
                        {actionLoading === user.id ? '⏳' : '❌'} Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usuarios Rechazados */}
      {rejectedUsers.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '15px' }}>
            ❌ Usuarios Rechazados ({rejectedUsers.length})
          </h2>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {rejectedUsers.map(user => (
              <div key={user.id} style={{
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '6px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                      {user.nombre} {user.apellidos}
                    </h3>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      📧 {user.email}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '12px' }}>
                      📅 Registrado: {new Date(user.fecha_registro).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleApproveUser(user.id)}
                      disabled={actionLoading === user.id}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: actionLoading === user.id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === user.id ? 0.6 : 1
                      }}
                    >
                      {actionLoading === user.id ? '⏳' : '✅'} Aprobar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de actualizar */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={fetchUsers}
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Actualizando...' : '🔄 Actualizar Lista'}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
