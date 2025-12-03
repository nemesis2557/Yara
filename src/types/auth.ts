
export interface User {
  sub: string;
  email: string;
  role: string;
  isAdmin: boolean;
  nombre?: string;
  apellido?: string;
  dni?: string;
  celular?: string;
  sexo?: string;
  rol?: string;
  activo?: boolean;
  avatar_url?: string;
  usuario_id?: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, passcode: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface Usuario {
  id: number;
  user_id: number;
  nombre: string;
  apellido: string;
  dni: string;
  celular?: string;
  sexo?: string;
  rol: 'admin' | 'mesero' | 'cajero' | 'chef' | 'ayudante';
  activo: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
