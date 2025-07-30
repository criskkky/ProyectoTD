import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function ProfileForm({ initialData = {}, onSubmit, buttonText = "Guardar" }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nombres: initialData.nombres || "",
      apellidos: initialData.apellidos || "",
      rut: initialData.rut || "",
      email: initialData.email || "",
      rol: initialData.rol || "",
      newPassword: "",
      updatedAt: initialData.updatedAt || ""
    }
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data) => {
    // Solo enviar los campos esperados por el backend
    const { nombres, apellidos, rut, email, rol, newPassword } = data;
    const payload = { nombres, apellidos, rut, email, rol };
    if (newPassword && newPassword.trim() !== "") {
      payload.newPassword = newPassword;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" autoComplete="off">
      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Nombres <span className="text-red-500">*</span></label>
        <input
          {...register("nombres", {
            required: "Los nombres son obligatorios",
            minLength: { value: 3, message: "Debe tener como mínimo 3 caracteres" },
            maxLength: { value: 50, message: "Debe tener como máximo 50 caracteres" },
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "Solo puede contener letras y espacios"
            }
          })}
          type="text"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.nombres?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Apellidos <span className="text-red-500">*</span></label>
        <input
          {...register("apellidos", {
            required: "Los apellidos son obligatorios",
            minLength: { value: 3, message: "Debe tener como mínimo 3 caracteres" },
            maxLength: { value: 50, message: "Debe tener como máximo 50 caracteres" },
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "Solo puede contener letras y espacios"
            }
          })}
          type="text"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.apellidos?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">RUT <span className="text-red-500">*</span></label>
        <input
          {...register("rut", {
            required: "El RUT es obligatorio",
            minLength: { value: 9, message: "El RUT debe tener como mínimo 9 caracteres" },
            maxLength: { value: 12, message: "El RUT debe tener como máximo 12 caracteres" },
            pattern: {
              value: /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/,
              message: "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x."
            },
            disabled: true
          })}
          type="text"
          placeholder="12345678-9"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.rut?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Email <span className="text-red-500">*</span></label>
        <input
          {...register("email", {
            required: "El email es obligatorio",
            minLength: { value: 15, message: "Debe tener como mínimo 15 caracteres" },
            maxLength: { value: 35, message: "Debe tener como máximo 35 caracteres" },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "El email debe ser válido"
            },
            validate: value =>
              /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
              "El correo electrónico debe tener un dominio válido después del '@'."
          })}
          type="email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.email?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Rol <span className="text-red-500">*</span></label>
        <select
          {...register("rol", {
            required: "El rol es obligatorio",
          })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled
        >
          <option value="user">Usuario</option>
          <option value="premium">Premium</option>
          <option value="premium2">Premium 2</option>
          <option value="admin">Administrador</option>
        </select>
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.rol?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Nueva contraseña</label>
        <input
          {...register("newPassword", {
            minLength: { value: 8, message: "Debe tener como mínimo 8 caracteres" },
            maxLength: { value: 26, message: "Debe tener como máximo 26 caracteres" },
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: "Solo puede contener letras y números"
            },
            validate: value => value === "" || /^[a-zA-Z0-9]+$/.test(value) || "Solo puede contener letras y números"
          })}
          type="password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.newPassword?.message || ""}
        </div>
      </div>


      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded font-semibold shadow hover:bg-blue-700 transition-all w-full mt-4"
      >
        {buttonText}
      </button>
    </form>
  );
}
