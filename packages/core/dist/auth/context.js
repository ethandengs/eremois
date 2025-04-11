import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from './service';
const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        isLoading: true,
        error: null,
    });
    const authService = AuthService.getInstance();
    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                setState(prev => ({ ...prev, user, isLoading: false }));
            }
            catch (error) {
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to initialize auth',
                    isLoading: false,
                }));
            }
        };
        initAuth();
    }, []);
    const signIn = async (credentials) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const user = await authService.signIn(credentials);
            setState(prev => ({ ...prev, user, isLoading: false }));
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to sign in',
                isLoading: false,
            }));
            throw error;
        }
    };
    const signUp = async (credentials) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const user = await authService.signUp(credentials);
            setState(prev => ({ ...prev, user, isLoading: false }));
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to sign up',
                isLoading: false,
            }));
            throw error;
        }
    };
    const signOut = async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await authService.signOut();
            setState(prev => ({ ...prev, user: null, isLoading: false }));
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to sign out',
                isLoading: false,
            }));
            throw error;
        }
    };
    return (_jsx(AuthContext.Provider, { value: { ...state, signIn, signUp, signOut }, children: children }));
};
//# sourceMappingURL=context.js.map