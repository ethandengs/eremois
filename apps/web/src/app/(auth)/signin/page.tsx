import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import Image from 'next/image'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function SignInPage() {
  return (
    <AuthLayout>
      <h2 className="text-center text-4xl font-bold tracking-tight mb-4">
        Welcome Back
      </h2>
      <p className="text-center text-gray-300">
        Don't have an account?{' '}
        <Link href="/signup" className="text-[#FF4B4B] hover:text-[#FF6B6B] font-medium">
          Create one now
        </Link>
      </p>
      <div className="mt-8">
        <div className="bg-gray-900/50 backdrop-blur-lg py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-800">
          <AuthForm mode="signin" />
        </div>
      </div>
    </AuthLayout>
  )
} 