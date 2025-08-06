import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

const CloudflareTurnstile = forwardRef(({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className = '',
  resetOnError = true
}, ref) => {
  const widgetRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState(null);
  const [error, setError] = useState(null);

  // Función para obtener el token actual
  const getResponse = useCallback(() => {
    if (window.turnstile && widgetId !== null) {
      try {
        return window.turnstile.getResponse(widgetId);
      } catch (err) {
        console.error('Error getting Turnstile response:', err);
        return null;
      }
    }
    return null;
  }, [widgetId]);

  // Función para resetear el captcha
  const reset = useCallback(() => {
    if (window.turnstile && widgetId !== null) {
      try {
        window.turnstile.reset(widgetId);
        setError(null);
      } catch (err) {
        console.error('Error resetting Turnstile:', err);
      }
    }
  }, [widgetId]);

  // Exponer métodos al componente padre a través de ref
  useImperativeHandle(ref, () => ({
    reset,
    getResponse
  }), [reset, getResponse]);

  // Cargar el script de Turnstile
  useEffect(() => {
    const loadTurnstileScript = () => {
      // Si ya está cargado, no cargar de nuevo
      if (window.turnstile) {
        setIsLoaded(true);
        return;
      }

      // Si ya existe el script, no agregarlo de nuevo
      if (document.querySelector('script[src*="turnstile"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setError('Error al cargar Cloudflare Turnstile');
        console.error('Error loading Turnstile script');
      };

      document.head.appendChild(script);
    };

    loadTurnstileScript();
  }, []);

  // Renderizar el widget cuando el script está cargado
  useEffect(() => {
    if (!isLoaded || !window.turnstile || !widgetRef.current) {
      return;
    }

    try {
      const id = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: theme,
        size: size,
        callback: (token) => {
          setError(null);
          if (onVerify) {
            onVerify(token);
          }
        },
        'error-callback': (errorCode) => {
          console.error('Turnstile error:', errorCode);
          setError('Error en la verificación del captcha');
          if (onError) {
            onError(errorCode);
          }
          // Auto-resetear en caso de error
          if (window.turnstile && id !== null) {
            setTimeout(() => {
              try {
                window.turnstile.reset(id);
                setError(null);
              } catch (err) {
                console.error('Error resetting after error:', err);
              }
            }, 1000);
          }
        },
        'expired-callback': () => {
          setError('El captcha ha expirado');
          if (onExpire) {
            onExpire();
          }
          // Auto-resetear cuando expira
          if (window.turnstile && id !== null) {
            setTimeout(() => {
              try {
                window.turnstile.reset(id);
                setError(null);
              } catch (err) {
                console.error('Error resetting after expiry:', err);
              }
            }, 1000);
          }
        }
      });

      setWidgetId(id);
    } catch (err) {
      console.error('Error rendering Turnstile widget:', err);
      setError('Error al inicializar el captcha');
    }
  }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire, resetOnError]);

  // Mostrar loading o error
  if (error) {
    return (
      <div className={`turnstile-error ${className}`}>
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-auto text-sm underline hover:no-underline"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`turnstile-loading ${className}`}>
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <svg className="animate-spin w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-600">Cargando verificación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`turnstile-widget ${className}`}>
      <div ref={widgetRef}></div>
    </div>
  );
});

export default CloudflareTurnstile;
