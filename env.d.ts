declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: number;
    readonly MONGODB_URI: string;
    readonly NODE_ENV: "development" | "production";
    readonly BASE_URL: string;
    readonly JWT_SECRET: string;
    readonly JWT_EXPIRES_IN: string;
    readonly JWT_COOKIE_EXPIRES_IN: number;
    readonly JWT_SECRET_RESET: string;
    readonly JWT_EXPIRE_RESET: string;
    readonly EMAIL_HOST: string;
    readonly EMAIL_PORT: number;
    readonly EMAIL_USERNAME: string;
    readonly EMAIL_PASSWORD: string;
    readonly App_NAME: string;
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;
    readonly GOOGLE_CALLBACK: string;
    readonly HMAC: string;
  }
}
