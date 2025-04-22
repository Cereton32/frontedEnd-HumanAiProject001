import React, { useState, useEffect, useRef } from 'react';
import firebase, { auth } from './firebase';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef(null);
  const recaptchaWidgetIdRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => {
      unsubscribe();
      // Clean up reCAPTCHA on unmount
      if (recaptchaWidgetIdRef.current) {
        window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
      }
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const setUpRecaptcha = async () => {
    try {
      // Clear existing reCAPTCHA if any
      if (recaptchaWidgetIdRef.current) {
        window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
      }

      // Create new verifier
      recaptchaVerifierRef.current = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          recaptchaVerifierRef.current = null;
        }
      });

      // Render and store widget ID
      const widgetId = await recaptchaVerifierRef.current.render();
      recaptchaWidgetIdRef.current = widgetId;
      return recaptchaVerifierRef.current;
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      throw error;
    }
  };

  const handleSendCode = async (phoneNumber) => {
    try {
      setLoading(true);
      
      // Ensure reCAPTCHA is properly set up
      const appVerifier = await setUpRecaptcha();
      
      // Send verification code
      const result = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
      
      setConfirmationResult(result);
      showNotification('Code sent to your phone', 'green');
    } catch (error) {
      console.error('SMS not sent', error);
      showNotification(`Error: ${error.message}`, 'red');
      // Reset reCAPTCHA on error
      if (recaptchaWidgetIdRef.current) {
        window.grecaptcha?.reset(recaptchaWidgetIdRef.current);
      }
      recaptchaVerifierRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    if (!confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(code);
      setUser(result.user);
      showNotification('Signed in successfully', 'blue');
    } catch (error) {
      console.error('Invalid code', error);
      showNotification('Invalid verification code', 'red');
    }
  };
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      showNotification('Logged out successfully', 'red');
      window.location.reload(); 
     // Refresh the window after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  const showNotification = (message, color) => {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.className = `fixed top-4 right-4 bg-${color}-600 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce z-50`;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const value = {
    user,
    loading,
    handleSendCode,
    handleVerifyCode,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Hidden container for reCAPTCHA */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
      {children}
    </AuthContext.Provider>
  );
};