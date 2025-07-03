# Dashboard Power BI - Frontend

Dashboard funcional para visualización de reportes de Power BI sin autenticación.

## 🚀 Características

- ✅ Lista de reportes disponibles
- ✅ Visualización de reportes embebidos de Power BI
- ✅ Navegación fluida entre lista y visor
- ✅ Manejo robusto de errores
- ✅ Interfaz responsive
- ✅ Sin autenticación requerida (desarrollo)

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** para build y desarrollo
- **PowerBI Client** para embebido
- **CSS-in-JS** para estilos

## 📋 Requisitos

- Node.js 16+
- npm o yarn
- Acceso a API de Power BI configurada

## ⚡ Instalación y Uso

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPO]
   cd powerbi-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env (no incluido en el repo)
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Build para producción**
   ```bash
   npm run build
   npm run preview
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── ReportList.tsx      # Lista de reportes
│   ├── ReportViewer.tsx    # Visor de reportes
│   ├── LoadingSpinner.tsx  # Componente de carga
│   ├── ErrorMessage.tsx    # Manejo de errores
│   └── ErrorBoundary.tsx   # Error boundary global
├── services/
│   └── api.ts             # Cliente API
├── App.tsx                # Componente principal
└── main.tsx              # Punto de entrada

```

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_POWERBI_CLIENT_ID=tu-client-id
VITE_POWERBI_WORKSPACE_ID=tu-workspace-id
```

### API Backend

Este frontend consume una API que debe proporcionar:

- `GET /api/reports` - Lista de reportes
- `GET /api/reports/:id/embed-token` - Token de embebido

## 🎯 Funcionalidades

### Lista de Reportes
- Carga automática de reportes disponibles
- Grid responsive con tarjetas de reporte
- Manejo de estados de carga y error

### Visor de Reportes
- Embebido nativo de Power BI
- Controles de navegación
- Limpieza automática de recursos

### Manejo de Errores
- Error boundary global
- Retry automático para errores 429
- Mensajes de error descriptivos

## 🔒 Seguridad

- ❌ **SIN autenticación** (solo para desarrollo)
- ✅ Variables sensibles en `.env` (no versionadas)
- ✅ API keys protegidas en `.gitignore`
- ✅ Validación de entrada en componentes

## 🚧 Estado del Proyecto

Este es un **dashboard funcional de desarrollo** sin implementación de autenticación. 

### ✅ Implementado
- Dashboard básico funcional
- Visualización de reportes
- Manejo de errores robusto
- Navegación fluida

### 🔄 Pendiente
- Sistema de autenticación
- Gestión de usuarios
- Caché de tokens
- Optimizaciones de rendimiento

## 🐛 Resolución de Problemas

### Error de pantalla en blanco
Si aparece una pantalla en blanco al navegar:
1. Verificar consola del navegador
2. Verificar que la API esté funcionando
3. Revisar configuración de variables de entorno

### Error 429 (Too Many Requests)
- El sistema reintenta automáticamente
- Esperar unos segundos entre solicitudes
- Verificar límites de la API de Power BI

## 📄 Licencia

Este proyecto es para uso interno de desarrollo.

## 👥 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

---

**Nota**: Este dashboard está configurado para desarrollo sin autenticación. Para producción, implementar sistema de autenticación robusto.
