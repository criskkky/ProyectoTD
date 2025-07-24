import React, { useEffect } from 'react';
import Form from './Form';
import { AiOutlineClose } from 'react-icons/ai';
import { BsQuestionCircle } from 'react-icons/bs';

export default function ProfilePopup({ show, setShow, data, action }) {
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
                    <button className='absolute top-2 right-2 text-red-500 hover:text-red-700' onClick={() => setShow(false)}>
                        <AiOutlineClose size={22} />
                    </button>
                    <Form
                        title="Editar perfil"
                        fields={[
                            {
                                // Campo oculto para el id (identificador principal)
                                name: "id",
                                fieldType: "input",
                                type: "hidden",
                                defaultValue: userData.id || "",
                            },
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
                                label: "RUT",
                                name: "rut",
                                defaultValue: userData.rut || "",
                                placeholder: '12.345.678-9',
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser XX.XXX.XXX-X o XXXXXXXX-X",
                                required: true,
                                disabled: true, // Solo lectura
                            },
                            {
                                label: (
                                    <span className="flex items-center gap-1">
                                        Nueva contraseña
                                        <span className="flex items-center gap-1 ml-auto text-sm text-blue-700">
                                            <BsQuestionCircle size={12} />
                                            <span className="tooltip-text ml-1">Este campo es opcional</span>
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
                        buttonText="Confirmar"
                        backgroundColor={'#fff'}
                        defaultValues={userData}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
