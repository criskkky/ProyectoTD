import React, { useEffect } from 'react';
import Form from './Form';
import { AiOutlineClose } from 'react-icons/ai';

export default function PubliPopup({ show, setShow, data, action }) {
    const publiData = data && data.length > 0 ? data[0] : null; // Usamos null en lugar de un objeto vacío

    useEffect(() => {
        if (show) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [show]);

    const handleSubmit = (formData) => {
        action(formData);
    };

    return (
        <div>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => setShow(false)}
                        >
                            <AiOutlineClose size={22} />
                        </button>
                        <Form
                            title={publiData && publiData.id ? "Editar publicación" : "Crear publicación"} // Validamos si publiData existe
                            fields={[
                                publiData && publiData.id && { // Solo incluir el campo "id" si existe publiData.id
                                    name: "id",
                                    fieldType: "input",
                                    type: "hidden",
                                    defaultValue: publiData.id,
                                },
                                {
                                    label: "Título",
                                    name: "titulo",
                                    defaultValue: publiData ? publiData.titulo : "",
                                    placeholder: "Título de la publicación",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    maxLength: 255,
                                },
                                {
                                    label: "Descripción",
                                    name: "descripcion",
                                    defaultValue: publiData ? publiData.descripcion : "",
                                    placeholder: "Descripción detallada",
                                    fieldType: "textarea",
                                    required: true,
                                    maxLength: 2000,
                                },
                                {
                                    label: "Modalidad",
                                    name: "modalidad",
                                    fieldType: "select",
                                    options: [
                                        { value: "presencial", label: "Presencial" },
                                        { value: "online", label: "Online" },
                                        { value: "mixta", label: "Mixta" },
                                    ],
                                    required: true,
                                    defaultValue: publiData ? publiData.modalidad : "",
                                },
                                {
                                    label: "Categoría",
                                    name: "categoria",
                                    fieldType: "select",
                                    options: [
                                        { value: "arte", label: "Arte" },
                                        { value: "construcción", label: "Construcción" },
                                        { value: "educacion", label: "Educación" },
                                        { value: "salud", label: "Salud" },
                                        { value: "servicios generales", label: "Servicios Generales" },
                                        { value: "tecnología", label: "Tecnología" },
                                    ],
                                    defaultValue: publiData ? publiData.categoria : "",
                                },
                            ].filter(Boolean)} // Filtrar campos nulos
                            onSubmit={handleSubmit}
                            buttonText={publiData && publiData.id ? "Actualizar" : "Crear"} // Validamos si publiData existe
                            backgroundColor={"#fff"}
                            defaultValues={publiData || {}} // Usamos un objeto vacío si publiData es null
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
