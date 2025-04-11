import { Request, Response } from 'express';
export declare const signup: (req: Request, res: Response) => Promise<any>;
export declare const login: (req: Request, res: Response) => Promise<any>;
export declare const me: (req: Request, res: Response) => Promise<any>;
export declare const logout: (req: Request, res: Response) => void;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<any>;
