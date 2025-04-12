import { z } from 'zod';

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_DEMO_FEATURES: z.string().transform((val) => val === 'true'),
  NEXT_PUBLIC_ENABLE_AUTH: z.string().transform((val) => val === 'true'),

  // Environment
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
});

/**
 * Validate and parse environment variables
 * Throws an error if any required variables are missing
 */
const validateEnv = () => {
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsedEnv.data;
};

export const env = validateEnv(); 