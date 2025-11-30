export interface TokenRequest {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
}

export interface User {
  email: string;
  is_superuser: boolean;
}