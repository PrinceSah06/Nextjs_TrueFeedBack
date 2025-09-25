
// additional.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET_KEY: string;
    }
  }
}

// If this file was already a module, this export prevents it from becoming global.
export {};
