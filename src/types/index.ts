export interface Report {
  id: number;
  nombre: string;
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