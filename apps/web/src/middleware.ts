import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client with the cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/features',
    '/features/living-timeline',
    '/features/task-management',
    '/features/edge-ai',
    '/about',
    '/about/privacy',
    '/about/technology',
    '/use-cases/personal',
    '/use-cases/teams',
    '/use-cases/enterprise',
    '/signin',
    '/signup'
  ]

  // Auth routes that should redirect to dashboard if user is already logged in
  const authRoutes = ['/signin', '/signup']

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname === route)

  // If there was an error getting the session, redirect to signin
  if (error) {
    console.error('Middleware session error:', error)
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/signin'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if user is logged in and trying to access auth routes
  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return res
  }

  // Redirect to sign in if accessing protected route without session
  if (!session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/signin'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public marketing pages (now handled in the middleware function)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|fonts).*)',
  ],
} 