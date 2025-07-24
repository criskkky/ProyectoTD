import { useState } from 'react';
import { updateUser } from '@/services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@/helpers/sweetAlert.js';
import { formatPostUpdate } from '@/helpers/formatData.js';

const useEditProfile = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState({});

  const openEditProfile = (userData) => {
    setUser(userData || {});
    setShowPopup(true);
  };

  const handleEditProfile = async (formData) => {
    if (!formData) return;

    // Elimina id, rol y newPassword vacío del body
    const { id, rol, newPassword, ...rest } = formData;
    const dataToSend = { ...rest };
    if (newPassword && newPassword.trim() !== "") {
      dataToSend.newPassword = newPassword;
    }

    try {
      const updatedUser = await updateUser(dataToSend, user.id);
      showSuccessAlert('¡Actualizado!', 'Tu perfil ha sido actualizado correctamente.');
      setShowPopup(false);

      const formattedUser = formatPostUpdate(updatedUser);
      sessionStorage.setItem('usuario', JSON.stringify(formattedUser));
      setUser(formattedUser);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      showErrorAlert('Error', 'Ocurrió un error al actualizar el perfil.');
    }
  };

  return {
    showPopup,
    setShowPopup,
    user,
    setUser,
    openEditProfile,
    handleEditProfile,
  };
};

export default useEditProfile;