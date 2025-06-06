import React, { useEffect } from 'react';
import Form from './Form';
import { AiOutlineClose } from 'react-icons/ai';
import { BsQuestionCircle } from 'react-icons/bs';

export default function Popup({ show, setShow, data, action }) {
    const userData = data && data.length > 0 ? data[0] : {};

    useEffect(() => {
        if (show) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        // Limpieza al desmontar
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [show]);

    const handleSubmit = (formData) => {
        action(formData);
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);
    return (
        <div>
            { show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg">
                    <button className='absolute top-2 right-2 text-gray-500 hover:text-gray-700' onClick={() => setShow(false)}>
                        <AiOutlineClose size={22} />
                    </button>
                    <Form
                        title="Editar usuario"
                        fields={[
                            {
                                label: "Nombres",
                                name: "nombres",
                                defaultValue: userData.nombres || "",
                                placeholder: 'Nombres',
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
                                defaultValue: userData.apellidos || "",
                                placeholder: 'Apellidos',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 3,
                                maxLength: 30,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Correo electrónico",
                                name: "email",
                                defaultValue: userData.email || "",
                                placeholder: 'example@gmail.cl',
                                fieldType: 'input',
                                type: "email",
                                required: true,
                                minLength: 15,
                                maxLength: 30,
                            },
                            {
                                label: "Rut",
                                name: "rut",
                                defaultValue: userData.rut || "",
                                placeholder: '12.345.678-9',
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                required: true,
                            },
                            {
                                label: "Rol",
                                name: "rol",
                                fieldType: 'select',
                                options: [
                                    { value: 'admin', label: 'Administrador' },
                                    { value: 'user', label: 'Usuario' },
                                ],
                                required: true,
                                defaultValue: userData.rol || "",
                            },
                            {
                                label: (
                                    <span>
                                        Nueva contraseña
                                        <span className='tooltip-icon'>
                                            <BsQuestionCircle />
                                            <span className='tooltip-text'>Este campo es opcional</span>
                                        </span>
                                    </span>
                                ),
                                name: "newPassword",
                                placeholder: "**********",
                                fieldType: 'input',
                                type: "password",
                                required: false,
                                minLength: 7,
                                maxLength: 26,
                                pattern: /^[a-zA-Z0-9]+$/,
                                patternMessage: "Debe contener solo letras y números",
                            }
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Editar usuario"
                        backgroundColor={'#fff'}
                        defaultValues={userData}
                    />
                </div>
            </div>
            )}
        </div>
    );
}