'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { signInWithPhone, signUpWithPhone, verifyOtp, setError } from '@/lib/slices/authSlice'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(state => state.auth)
  const [step, setStep] = useState<'signin' | 'signup' | 'otp'>('signin')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')

  if (!isOpen) return null

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setError(null))

    if (step === 'signup') {
      const result = await dispatch(signUpWithPhone(phone, name))
      if (result.success) {
        setStep('otp')
      }
    } else {
      const result = await dispatch(signInWithPhone(phone))
      if (result.success) {
        setStep('otp')
      }
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setError(null))

    const result = await dispatch(verifyOtp(phone, otp))
    if (result.success) {
      onClose()
      setStep('signin')
      setPhone('')
      setName('')
      setOtp('')
    }
  }

  const handleClose = () => {
    onClose()
    setStep('signin')
    setPhone('')
    setName('')
    setOtp('')
    dispatch(setError(null))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-10 shadow-2xl relative animate-popupScale">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {step === 'otp' ? (
          <div>
            <h2 className="text-3xl font-bold text-purple mb-3 text-center">Verify OTP</h2>
            <p className="text-gray-600 mb-6 text-center">
              Enter the OTP sent to +91 {phone}
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple to-mint text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('signin')}
                className="w-full text-gray-600 hover:text-purple text-sm"
              >
                Change phone number
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-purple mb-3 text-center">
              {step === 'signup' ? 'Sign Up' : 'Sign In'}
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              {step === 'signup' 
                ? 'Create your account to get started' 
                : 'Welcome back! Sign in to continue'}
            </p>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {step === 'signup' && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              )}

              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || phone.length !== 10}
                className="w-full bg-gradient-to-r from-purple to-mint text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : step === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(step === 'signin' ? 'signup' : 'signin')
                  dispatch(setError(null))
                }}
                className="w-full text-gray-600 hover:text-purple text-sm"
              >
                {step === 'signin' 
                  ? "Don't have an account? Sign Up" 
                  : 'Already have an account? Sign In'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

