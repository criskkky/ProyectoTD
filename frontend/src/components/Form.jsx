import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Form = ({ title, fields, buttonText, onSubmit, footerContent, backgroundColor }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form
      className="w-full max-w-md mx-auto p-8 rounded-lg shadow-md flex flex-col gap-2"
      style={{ backgroundColor: backgroundColor }}
      onSubmit={handleSubmit(onFormSubmit)}
      autoComplete="off"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
      {fields.map((field, index) => (
        <div className="flex flex-col gap-1 relative" key={index}>
          {field.label && <label htmlFor={field.name} className="font-medium">{field.label}</label>}
          {field.fieldType === 'input' && (
            <div className="relative">
              <input
                {...register(field.name, {
                  required: field.required ? 'Este campo es obligatorio' : false,
                  minLength: field.minLength ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` } : false,
                  maxLength: field.maxLength ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` } : false,
                  pattern: field.pattern ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' } : false,
                  validate: field.validate || {},
                })}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type === 'password' && field.name === 'password' ? (showPassword ? 'text' : 'password') :
                  field.type === 'password' && field.name === 'newPassword' ? (showNewPassword ? 'text' : 'password') :
                    field.type}
                defaultValue={field.defaultValue || ''}
                disabled={field.disabled}
                onChange={field.onChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              />
              {field.type === 'password' && field.name === 'password' && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              )}
              {field.type === 'password' && field.name === 'newPassword' && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              )}
            </div>
          )}
          {field.fieldType === 'textarea' && (
            <textarea
              {...register(field.name, {
                required: field.required ? 'Este campo es obligatorio' : false,
                minLength: field.minLength ? { value: field.minLength, message: `Debe tener al menos ${field.minLength} caracteres` } : false,
                maxLength: field.maxLength ? { value: field.maxLength, message: `Debe tener máximo ${field.maxLength} caracteres` } : false,
                pattern: field.pattern ? { value: field.pattern, message: field.patternMessage || 'Formato no válido' } : false,
                validate: field.validate || {},
              })}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue || ''}
              disabled={field.disabled}
              onChange={field.onChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          )}
          {field.fieldType === 'select' && (
            <select
              {...register(field.name, {
                required: field.required ? 'Este campo es obligatorio' : false,
                validate: field.validate || {},
              })}
              name={field.name}
              defaultValue={field.defaultValue || ''}
              disabled={field.disabled}
              onChange={field.onChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="">Seleccionar opción</option>
              {field.options && field.options.map((option, optIndex) => (
                <option className="options-class" key={optIndex} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          <div className={`text-red-500 text-sm min-h-[1.5em] ${errors[field.name] || field.errorMessageData ? 'visible' : 'invisible'}`}>
            {errors[field.name]?.message || field.errorMessageData || ''}
          </div>
        </div>
      ))}
      {buttonText && <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">{buttonText}</button>}
      {footerContent && <div className="text-center text-sm text-gray-500">{footerContent}</div>}
    </form>
  );
};

export default Form;