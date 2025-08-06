import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '@/services/auth.service.js';
import Form from '@/components/Form';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import useLogin from '@/hooks/auth/useLogin.jsx';
import useTurnstile from '@/hooks/useTurnstile.jsx';
import { MdErrorOutline } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    errorEmail,
    errorPassword,
    errorData,
    handleInputChange
  } = useLogin();

  const {
    turnstileToken,
    turnstileError,
    turnstileRef,
    handleTurnstileVerify,
    handleTurnstileError,
    handleTurnstileExpire,
    validateTurnstile,
    handleSubmitError
  } = useTurnstile();

  const loginSubmit = async (data) => {
    try {
      // Validar captcha antes de enviar
      if (!validateTurnstile()) {
        return;
      }

      // Incluir token de Turnstile en los datos
      const loginData = {
        ...data,
        turnstileToken
      };

      const response = await login(loginData);
      if (response.status === 'Success') {
        setErrorMsg("");
        navigate('/home');
      } else if (response.status === 'Client error') {
        // Si hay error, resetear el captcha
        handleSubmitError();
        errorData(response.details);
        setErrorMsg("Correo o contraseña incorrectos.");
      } else {
        handleSubmitError();
        setErrorMsg("Error al iniciar sesión. Intenta nuevamente.");
      }
    } catch (error) {
      handleSubmitError();
      setErrorMsg("Error de conexión. Intenta nuevamente.");
      console.error('Login error:', error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <button
          className="mb-4 text-blue-600 hover:underline font-semibold"
          onClick={() => navigate('/')}
          type="button"
        >
          ← Inicio
        </button>
        {errorMsg && (
          <div className="px-8">
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-300 bg-red-50 shadow animate-pulse">
            <MdErrorOutline size={22} className="inline-block text-red-500" />
            <span className="text-center text-red-700 font-medium">{errorMsg}</span>
          </div>
          </div>
        )}
        <Form
          title="Iniciar sesión"
          fields={[
            {
              label: "Correo electrónico",
              name: "email",
              placeholder: "ejemplo@dominio.cl",
              fieldType: 'input',
              type: "email",
              required: true,
              minLength: 5,
              maxLength: 30,
              errorMessageData: errorEmail,
              validate: {
                emailDomain: (value) => value.includes('@'),
              },
              onChange: (e) => handleInputChange('email', e.target.value),
            },
            {
              label: "Contraseña",
              name: "password",
              placeholder: "**********",
              fieldType: 'input',
              type: "password",
              required: true,
              minLength: 7,
              maxLength: 26,
              pattern: /^[a-zA-Z0-9]+$/,
              patternMessage: "Debe contener solo letras y números",
              errorMessageData: errorPassword,
              onChange: (e) => handleInputChange('password', e.target.value)
            },
          ]}
          buttonText="Iniciar sesión"
          onSubmit={loginSubmit}
          footerContent={
            <>
              {/* Turnstile CAPTCHA */}
              <div className="mt-4 mb-6">
                <CloudflareTurnstile
                  ref={turnstileRef}
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  theme="light"
                  size="normal"
                  className="flex justify-center"
                />
                {turnstileError && (
                  <div className="mt-2 text-center text-red-600 text-sm font-medium">
                    {turnstileError}
                  </div>
                )}
              </div>
              <p className="mt-4 text-center text-sm text-gray-600">
                ¿No tienes cuenta?,{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  ¡Regístrate aquí!
                </a>
              </p>
            </>
          }
          className="space-y-6"
          titleClassName="text-2xl font-bold text-center text-blue-700 mb-6"
          buttonClassName="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          fieldClassName="mb-4"
          labelClassName="block text-gray-700 font-medium mb-1"
          inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          errorClassName="text-red-500 text-xs mt-1"
        />
      </div>
    </main>
  );
};

export default Login;