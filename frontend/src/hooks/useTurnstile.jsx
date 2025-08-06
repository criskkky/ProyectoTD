import { useState, useCallback, useRef } from 'react';

/**
 * Hook personalizado para manejar la funcionalidad de Cloudflare Turnstile
 * @returns {Object} - Objeto con estados y funciones para manejar Turnstile
 */
const useTurnstile = () => {
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileError, setTurnstileError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const turnstileRef = useRef(null);

  // Manejar verificación exitosa
  const handleTurnstileVerify = useCallback((token) => {
    setTurnstileToken(token);
    setIsVerified(true);
    setTurnstileError(null);
  }, []);

  // Manejar errores de Turnstile
  const handleTurnstileError = useCallback((error) => {
    setTurnstileToken(null);
    setIsVerified(false);
    setTurnstileError('Error en la verificación del captcha. Por favor, inténtalo de nuevo.');
    console.error('Turnstile error:', error);
  }, []);

  // Manejar expiración del token
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
    setIsVerified(false);
    setTurnstileError('El captcha ha expirado. Por favor, complétalo de nuevo.');
  }, []);

  // Resetear el estado de Turnstile
  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    setIsVerified(false);
    setTurnstileError(null);
    
    // Resetear el widget usando la referencia
    if (turnstileRef.current && turnstileRef.current.reset) {
      try {
        turnstileRef.current.reset();
      } catch (error) {
        console.warn('Error resetting turnstile widget:', error);
      }
    }
  }, []);

  // Validar si el captcha está completo antes de enviar el formulario
  const validateTurnstile = useCallback(() => {
    if (!isVerified || !turnstileToken) {
      setTurnstileError('Por favor, completa la verificación del captcha antes de continuar.');
      return false;
    }
    return true;
  }, [isVerified, turnstileToken]);

  // Función para manejar errores de envío y resetear el captcha
  const handleSubmitError = useCallback(() => {
    setTurnstileToken(null);
    setIsVerified(false);
    setTurnstileError('Por favor, completa el captcha nuevamente.');
    
    // Resetear el widget usando la referencia con un pequeño delay
    setTimeout(() => {
      if (turnstileRef.current && turnstileRef.current.reset) {
        try {
          turnstileRef.current.reset();
        } catch (error) {
          console.warn('Error resetting turnstile widget:', error);
        }
      }
    }, 100);
  }, []);

  return {
    // Estados
    turnstileToken,
    turnstileError,
    isVerified,
    
    // Referencia al componente
    turnstileRef,
    
    // Funciones de callback para el componente Turnstile
    handleTurnstileVerify,
    handleTurnstileError,
    handleTurnstileExpire,
    
    // Funciones de utilidad
    resetTurnstile,
    validateTurnstile,
    handleSubmitError,
  };
};

export default useTurnstile;
