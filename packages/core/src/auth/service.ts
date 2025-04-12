import { User } from './types';

export class AuthService {
  private user: User | null = null;

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

export const authService = new AuthService(); 