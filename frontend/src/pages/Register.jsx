import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@services/auth.service.js';
import Form from "@components/Form";
import useRegister from '@hooks/auth/useRegister.jsx';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const Register = () => {
	const navigate = useNavigate();
	const {
        errorEmail,
        errorRut,
        errorData,
        handleInputChange
    } = useRegister();

	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({});

	const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

	const handleStepSubmit = (data) => {
		setFormData(prev => ({ ...prev, ...data }));
		setStep(step + 1);
	};

	const registerSubmit = async (data) => {
		const finalData = { ...formData, ...data };
		try {
			const response = await register(finalData);
			if (response.status === 'Success') {
				showSuccessAlert('¡Registrado!','Usuario registrado exitosamente.');
				setTimeout(() => {
					navigate('/auth');
				}, 3000)
			} else if (response.status === 'Client error') {
				errorData(response.details);
			}
		} catch (error) {
			console.error("Error al registrar un usuario: ", error);
			showErrorAlert('Cancelado', 'Ocurrió un error al registrarse.');
		}
	};

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                {/* Stepper indicator */}
                <div className="flex justify-center mb-6">
                    <div className={`w-4 h-4 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-blue-200'} mx-1`} />
                    <div className={`w-4 h-4 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-blue-200'} mx-1`} />
                </div>
                {step === 1 && (
                    <Form
                        title="Datos personales"
                        fields={[
                            {
                                label: "Nombres",
                                name: "nombres",
                                placeholder: "Ingrese sus nombres",
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 3,
                                maxLength: 30,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Apellidos",
                                name: "apellidos",
                                placeholder: "Ingrese sus apellidos",
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 3,
                                maxLength: 30,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Rut",
                                name: "rut",
                                placeholder: "12.345.678-9",
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                required: true,
                                errorMessageData: errorRut,
                                onChange: (e) => handleInputChange('rut', e.target.value)
                            },
                        ]}
                        buttonText="Siguiente"
                        onSubmit={handleStepSubmit}
                        className="space-y-6"
                        titleClassName="text-2xl font-bold text-center text-blue-700 mb-6"
                        buttonClassName="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
                        fieldClassName="mb-4"
                        labelClassName="block text-gray-700 font-medium mb-1"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        errorClassName="text-red-500 text-xs mt-1"
                        footerContent={
                            <p className="mt-4 text-center text-sm text-gray-600">
                                ¿Ya tienes cuenta?,{" "}
                                <a
                                    href="/auth"
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    ¡Inicia sesión aquí!
                                </a>
                            </p>
                         }
                    />
                )}
                {step === 2 && (
                    <Form
                        title="Datos de acceso"
                        fields={[
                            {
                                label: "Correo electrónico",
                                name: "email",
                                placeholder: "ejemplo@gmail.com",
                                fieldType: 'input',
                                type: "email",
                                required: true,
                                minLength: 15,
                                maxLength: 35,
                                errorMessageData: errorEmail,
                                validate: {
                                    emailDomain: (value) => value.includes('@'),
                                },
                                onChange: (e) => handleInputChange('email', e.target.value)
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
                            },
                        ]}
                        buttonText="Registrarse"
                        onSubmit={registerSubmit}
                        footerContent={
                            <>
                                <button
                                    type="button"
                                    className="w-full py-2 px-4 mb-2 bg-[#FFD580] hover:bg-[#FFA500] text-white font-semibold rounded-lg shadow transition-colors"
                                    onClick={() => setStep(1)}
                                >
                                    ← Volver
                                </button>
                                <p className="mt-4 text-center text-sm text-gray-600">
                                    ¿Ya tienes cuenta?,{" "}
                                    <a
                                        href="/auth"
                                        className="text-blue-600 hover:underline font-semibold"
                                    >
                                        ¡Inicia sesión aquí!
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
                )}
            </div>
        </main>
    );
};

export default Register;