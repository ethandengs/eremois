import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <h2 className="text-center text-4xl font-bold tracking-tight mb-4">
        Create Your Account
      </h2>
      <p className="text-center text-gray-300">
        Already have an account?{' '}
        <Link href="/signin" className="text-[#FF4B4B] hover:text-[#FF6B6B] font-medium">
          Sign in instead
        </Link>
      </p>
      <div className="mt-8">
        <div className="bg-gray-900/50 backdrop-blur-lg py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-800">
          <AuthForm mode="signup" />
        </div>
      </div>
    </AuthLayout>
  )
} 