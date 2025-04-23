import React, { useState, useEffect } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Player } from '@lottiefiles/react-lottie-player'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneAuth = () => {
  const { user, loading, handleSendCode, handleVerifyCode } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const navigate = useNavigate()

  const developerInstructions = [
    "I don't have firebase Billing account, due to which firebase is not allowing OTP sent functionality",
    "Using test phone numbers with predefined OTPs (123456) for demonstration:",
    "→ 9934601244",
    "→ 8619419609", 
    "→ 8529380440",
    "→ 6205306066",
    "First API response may take 1 minute (free Render hosting)"
  ]

  useEffect(() => {
    let interval
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown])

  useEffect(() => {
    if (user) {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        setShowAnimation(false)
        navigate('/home')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user, navigate])

  const handleCodeChange = (e) => {
    setCode(e.target.value)
  }

  const sendCode = async () => {
    if (phoneNumber.length >= 10) {
      try {
        await handleSendCode(`+${phoneNumber}`)
        setOtpSent(true)
        setCountdown(30)
      } catch (error) {
        alert('Failed to send OTP: ' + error.message)
        setOtpSent(false)
      }
    } else {
      alert('Enter a valid phone number')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4">
      {showAnimation && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <Player
            autoplay
            loop={false}
            src="https://lottie.host/embed/053f5967-c2cb-4e01-9c4c-dd6785a1942c/pSXxeOm02e.lottie"
            className="w-full h-full"
          />
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Phone Verification
          </h1>
          <p className="text-gray-500 mt-2">Enter your phone number to continue</p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <PhoneInput
              country={'in'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass="!w-full !py-3 !pl-14 !rounded-lg !border !border-gray-200 focus:!ring-2 focus:!ring-purple-500 focus:!border-transparent"
              dropdownClass="!rounded-lg !border !border-gray-200"
              enableSearch
            />
          </div>

          <button
            onClick={sendCode}
            disabled={loading || countdown > 0}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
          </button>

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            Developer Notes
          </button>

          {showInstructions && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Testing Information</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {developerInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-400 mr-2 mt-1">•</span>
                        <span className={instruction.startsWith("→") ? "font-mono text-indigo-600" : ""}>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {otpSent && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={6}
                />
                {code.length > 0 && (
                  <div className="absolute right-3 top-3.5 text-xs font-medium text-gray-400">
                    {code.length}/6
                  </div>
                )}
              </div>
              <button
                onClick={() => handleVerifyCode(code)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
              >
                Verify & Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhoneAuth