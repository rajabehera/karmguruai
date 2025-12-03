/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
  // add other env vars here if needed later
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}