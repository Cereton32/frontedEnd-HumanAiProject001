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
  const navigate = useNavigate()

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      {showAnimation && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-white flex items-center justify-center">
          <Player
            autoplay
            loop={false}
            src="https://lottie.host/embed/053f5967-c2cb-4e01-9c4c-dd6785a1942c/pSXxeOm02e.lottie"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Login with Phone</h1>
        <div className="space-y-4">
          <PhoneInput
            country={'in'}
            value={phoneNumber}
            onChange={(phone) => setPhoneNumber(phone)}
            inputClass="!w-full !py-3 !pl-14 !rounded-xl !border !border-gray-300 focus:!ring-2 focus:!ring-purple-500"
            inputStyle={{ width: '100%' }}
            specialLabel=""
            enableSearch
          />
          <button
            id="sign-in-button"
            onClick={sendCode}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition duration-300 disabled:opacity-50"
            disabled={loading || countdown > 0}
          >
            {loading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
          </button>

          {otpSent && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={code}
                onChange={handleCodeChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleVerifyCode(code)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-300"
              >
                Verify Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhoneAuth
