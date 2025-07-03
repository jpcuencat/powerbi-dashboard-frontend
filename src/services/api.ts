import axios from 'axios';

// Definir tipos directamente aquí para evitar problemas de importación
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    console.error('API Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    let message = 'Error desconocido';
    
    if (error.response?.status === 429) {
      message = 'Demasiadas solicitudes. El servicio está temporalmente limitado. Intenta nuevamente en unos momentos.';
    } else if (error.response?.status === 401) {
      message = 'Error de autenticación con Power BI. Verifica las credenciales.';
    } else if (error.response?.status === 403) {
      message = 'No tienes permisos para acceder a este reporte.';
    } else if (error.response?.status === 404) {
      message = 'El reporte solicitado no fue encontrado.';
    } else if (error.response?.status >= 500) {
      message = 'Error interno del servidor. Intenta nuevamente más tarde.';
    } else {
      message = error.response?.data?.error || error.message || 'Error desconocido';
    }
    
    return Promise.reject(new Error(message));
  }
);

export const reportService = {
  async getReports(): Promise<Report[]> {
    try {
      console.log('Fetching reports from:', `${API_BASE_URL}/reportes`);
      const response = await api.get<Report[]>('/reportes');
      console.log('Reports response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  },

  async getEmbedToken(reportId: number): Promise<EmbedTokenResponse> {
    try {
      console.log('Fetching embed token for report:', reportId);
      const response = await api.post<EmbedTokenResponse>('/embed-token', {
        reportId
      });
      console.log('Embed token response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener token de embedding:', error);
      throw error;
    }
  },
};

export default api;
