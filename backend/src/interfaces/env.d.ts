declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    PORT?: string;
    JWT_SECRET: string;
    TWO_FACTOR_API_KEY: string;
  }
}
