/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Override the API base URL. Defaults to "" (uses the Vite dev proxy). */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
