'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      
      // Wait briefly for session to be fully established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Clear loading state
      setLoading(false)
      
      // Refresh the router to trigger middleware re-evaluation
      router.refresh()
      
      // Navigate to dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 text-red-200 p-4 rounded-xl text-sm border border-red-800"
        >
          {error}
        </motion.div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:ring-[#FF4B4B] focus:border-[#FF4B4B] transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:ring-[#FF4B4B] focus:border-[#FF4B4B] transition-colors"
          placeholder={mode === 'signup' ? 'Choose a strong password' : 'Enter your password'}
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-[#FF4B4B] hover:bg-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4B4B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base"
        >
          {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </motion.div>
    </form>
  )
} 