import { User, SignInCredentials, SignUpCredentials } from './types';

export class AuthService {
  private static instance: AuthService | null = null;
  private user: User | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.user;
  }

  async signIn(credentials: SignInCredentials): Promise<User> {
    // Implement actual sign in logic
    throw new Error('Not implemented');
  }

  async signUp(credentials: SignUpCredentials): Promise<User> {
    // Implement actual sign up logic
    throw new Error('Not implemented');
  }

  async signOut(): Promise<void> {
    this.user = null;
  }

  setUser(user: User | null) {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
} 