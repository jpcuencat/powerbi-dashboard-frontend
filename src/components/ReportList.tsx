import React, { useState, useEffect, useCallback, useRef } from 'react';
import { reportService } from '../services/api';

// Definir tipo localmente
interface Report {
  id: number;
  nombre: string;
}
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ReportListProps {
  onReportSelect: (report: Report) => void;
}

const ReportList: React.FC<ReportListProps> = ({ onReportSelect }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  console.log('ReportList component rendered');
  console.log('Current state:', { reports: reports.length, loading, error, isMounted });

  const fetchReports = useCallback(async () => {
    // Cancelar cualquier solicitud anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      console.log('Fetching reports...');
      setLoading(true);
      setError(null);
      
      const data = await reportService.getReports();
      
      // Solo actualizar el estado si el componente sigue montado
      if (isMounted && !abortControllerRef.current.signal.aborted) {
        console.log('Reports fetched successfully:', data);
        setReports(data);
      }
    } catch (err) {
      // Solo manejar el error si no fue cancelado y el componente sigue montado
      if (isMounted && !abortControllerRef.current?.signal.aborted) {
        console.error('Error fetching reports:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar reportes');
      }
    } finally {
      // Solo actualizar loading si el componente sigue montado
      if (isMounted && !abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    console.log('ReportList useEffect triggered - Component mounted');
    setIsMounted(true);
    fetchReports();
    
    // Cleanup function
    return () => {
      console.log('ReportList cleanup - Component unmounting');
      setIsMounted(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReports]);

  if (loading) {
    return <LoadingSpinner text="Cargando reportes..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchReports} />;
  }

  if (reports.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '48px 20px',
        backgroundColor: 'white',
        border: '2px solid orange',
        margin: '20px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#333', 
          marginBottom: '8px' 
        }}>
          No hay reportes disponibles
        </h3>
        <p style={{ color: '#666' }}>No se encontraron reportes para mostrar.</p>
      </div>
    );
  }

  console.log('Rendering reports list with', reports.length, 'reports');

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: '24px' 
      }}>
        Reportes de Power BI ({reports.length} encontrados)
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {reports.map((report) => {
          console.log('Rendering report:', report);
          return (
            <div
              key={report.id}
              style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                console.log('Report clicked:', report);
                onReportSelect(report);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#007bff';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '10px'
              }}>
                {report.nombre}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '15px'
              }}>
                ID: {report.id}
              </p>
              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Ver Reporte
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportList;