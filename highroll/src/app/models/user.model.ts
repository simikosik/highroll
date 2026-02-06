export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: Date;
}

export interface AuthCredentials {
  username?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
