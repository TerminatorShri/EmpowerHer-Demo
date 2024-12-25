declare module "*.svg" {
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "@env" {
  export const API_KEY: string;
  export const AUTH_DOMAIN: string;
  export const PROJECT_ID: string;
  export const STORAGE_BUCKET: string;
  export const MESSAGING_SENDER_ID: string;
  export const APP_ID: string;
  export const ACCESS_TOKEN_SECRET: string;
  export const REFRESH_TOKEN_SECRET: string;
  export const ACCESS_TOKEN_EXPIRES_IN: string;
  export const REFRESH_TOKEN_EXPIRES_IN: string;
  export const ORGANIZATION_MAIL: string;
  export const ORGANIZATION_PASSWORD: string;
  export const CLOUD_NAME_CLOUDINARY: string;
  export const API_KEY_CLOUDINARY: string;
  export const API_SECRET_CLOUDINARY: string;
  export const TEST_NUMBER: string;
  export const TEST_NUMBER2: string;
  export const BACKEND_URL: string;
  export const RAKSHITA_SERVER: string;
  export const GEMINI_API_KEY: string;
  export const PRESET_NAME: string;
  export const CLOUD_NAME: string;
}
