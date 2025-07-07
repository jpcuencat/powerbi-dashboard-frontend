export interface Report {
  id: number;
  nombre: string;
  workspace_id: string;
  report_id: string;
  pagina_default?: string;
  estado?: string;
  Descripcion?: string;
  imagen_url?: string;
}

export interface EmbedTokenResponse {
  embedToken: string;
  embedUrl: string;
  reportId: string;
  workspaceId: string;
}

export interface ApiError {
  error: string;
  details?: any[];
}