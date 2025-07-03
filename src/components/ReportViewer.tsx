import React, { useEffect, useRef, useState } from 'react';
import { reportService } from '../services/api';

// Definir tipos localmente
interface Report {
  id: number;
  nombre: string;
}

interface EmbedTokenResponse {
  embedToken: string;
  embedUrl: string;
  reportId: string;
  workspaceId: string;
}
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { models, service, factories } from 'powerbi-client';

interface ReportViewerProps {
  report: Report;
  onBack: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onBack }) => {
  const [embedData, setEmbedData] = useState<EmbedTokenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const fetchEmbedToken = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Si es un reintento por error 429, esperar un poco
      if (isRetry && retryCount > 0) {
        console.log(`Reintentando después de ${retryCount * 2} segundos...`);
        await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
      }
      
      const data = await reportService.getEmbedToken(report.id);
      setEmbedData(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el token de embedding';
      console.error('Error fetching embed token:', errorMessage);
      
      // Si es error 429 y no hemos reintentado muchas veces, reintentar automáticamente
      if (errorMessage.includes('429') || errorMessage.includes('Demasiadas solicitudes')) {
        if (retryCount < 3) {
          console.log(`Error 429 detectado. Reintentando automáticamente (${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchEmbedToken(true), 3000); // Reintentar en 3 segundos
          setError(`Demasiadas solicitudes. Reintentando automáticamente en 3 segundos... (${retryCount + 1}/3)`);
          return;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbedToken();
  }, [report.id]);

  useEffect(() => {
    if (embedData && reportContainerRef.current) {
      const embedConfig: models.IEmbedConfiguration = {
        type: 'report',
        id: embedData.reportId,
        embedUrl: embedData.embedUrl,
        accessToken: embedData.embedToken,
        tokenType: models.TokenType.Embed,
        settings: {
          panes: {
            filters: {
              expanded: false,
              visible: true
            }
          },
          background: models.BackgroundType.Transparent,
        }
      };

      const powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );

      powerbi.embed(reportContainerRef.current, embedConfig);

      return () => {
        // Verificar que el contenedor aún existe antes de intentar hacer reset
        if (reportContainerRef.current) {
          try {
            powerbi.reset(reportContainerRef.current);
            console.log('PowerBI embed reset successfully');
          } catch (error) {
            console.warn('Error during PowerBI cleanup:', error);
          }
        } else {
          console.log('ReportViewer cleanup: Container ref is null, skipping reset');
        }
      };
    }
  }, [embedData]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #ddd', 
          padding: '16px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#333', 
              margin: 0 
            }}>
              {report.nombre}
            </h1>
            <button
              onClick={onBack}
              style={{
                padding: '8px 16px',
                color: '#666',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Volver
            </button>
          </div>
        </div>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <LoadingSpinner size="large" text="Cargando reporte..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #ddd', 
          padding: '16px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#333', 
              margin: 0 
            }}>
              {report.nombre}
            </h1>
            <button
              onClick={onBack}
              style={{
                padding: '8px 16px',
                color: '#666',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Volver
            </button>
          </div>
        </div>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <ErrorMessage message={error} onRetry={() => fetchEmbedToken()} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #ddd', 
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: 0 
          }}>
            {report.nombre}
          </h1>
          <button
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
      <div style={{ 
        flex: 1, 
        backgroundColor: '#f8f9fa',
        padding: '10px'
      }}>
        <div
          ref={reportContainerRef}
          style={{ 
            width: '100%', 
            height: '100%', 
            minHeight: '600px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
      </div>
    </div>
  );
};

export default ReportViewer;