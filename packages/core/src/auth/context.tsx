import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  AuthContextType,
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  User,
} from "./types";
import { AuthService } from "./service";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const authService = AuthService.getInstance();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setState((prev) => ({ ...prev, user, isLoading: false }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to initialize auth",
          isLoading: false,
        }));
      }
    };

    initAuth();
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.signIn(credentials);
      setState((prev) => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to sign in",
        isLoading: false,
      }));
      throw error;
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.signUp(credentials);
      setState((prev) => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to sign up",
        isLoading: false,
      }));
      throw error;
    }
  };

  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signOut();
      setState((prev) => ({ ...prev, user: null, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to sign out",
        isLoading: false,
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
