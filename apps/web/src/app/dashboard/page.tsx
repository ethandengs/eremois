'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#111111] text-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-6">Welcome, {user?.email}</h1>
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="text-gray-300 mb-4">
              Welcome to erēmois! You're now ready to start managing your time with privacy and intelligence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Create Your First Task</h3>
                <p className="text-gray-400">Start by creating your first task and organizing your time.</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Explore Timeline</h3>
                <p className="text-gray-400">View your tasks in our intuitive timeline interface.</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Set Up AI Features</h3>
                <p className="text-gray-400">Configure AI to help optimize your time management.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 