import { useNavigate } from 'react-router-dom';
import { login } from '@/services/auth.service.js';
import Form from '@/components/Form';
import useLogin from '@/hooks/auth/useLogin.jsx';

const Login = () => {
  const navigate = useNavigate();
  const {
    errorEmail,
    errorPassword,
    errorData,
    handleInputChange
  } = useLogin();

  const loginSubmit = async (data) => {
    try {
      const response = await login(data);
      if (response.status === 'Success') {
        navigate('/home');
      } else if (response.status === 'Client error') {
        errorData(response.details);
      }
    } catch (error) {
      console.log(error);
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
            <p className="mt-4 text-center text-sm text-gray-600">
              ¿No tienes cuenta?,{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                ¡Regístrate aquí!
              </a>
            </p>
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