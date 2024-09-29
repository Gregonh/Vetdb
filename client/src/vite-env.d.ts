/// <reference types="vite/client" />

//avoid the any problem when trying to use the env variables

interface ImportMetaEnv {
  VITE_NODE_ENV: string;
  VITE_API_SERVER_URL: string;
  VITE_DOMAIN: string;
  VITE_CALLBACK_URL: string;
  VITE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
