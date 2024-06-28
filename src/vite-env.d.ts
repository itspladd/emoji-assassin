/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTO_JOIN_DEBUG_ROOM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}