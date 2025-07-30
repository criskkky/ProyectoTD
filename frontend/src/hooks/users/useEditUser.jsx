import { useState } from 'react';
import { updateUser } from '@/services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@/helpers/sweetAlert.js';
import { formatPostUpdate } from '@/helpers/formatData.js';

const useEditUser = (setUsers) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    
    const handleClickUpdate = () => {
        if (dataUser.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedUserData) => {
        if (updatedUserData && dataUser.length > 0) {
            try {
                const { id, newPassword, ...rest } = updatedUserData;
                const dataToSend = { ...rest };
                if (newPassword && newPassword.trim() !== "") {
                    dataToSend.newPassword = newPassword;
                }

                const updatedUser = await updateUser(dataToSend, dataUser[0].id);
                showSuccessAlert('¡Actualizado!','El usuario ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                const formattedUser = formatPostUpdate(updatedUser);

                setUsers(prevUsers => prevUsers.map(user => {
                    console.log("Usuario actual:", user);
                    if (user.id === formattedUser.id) {
                        console.log("Reemplazando con:", formattedUser);
                    }
                    return user.id === formattedUser.id ? formattedUser : user;
                }));

                setDataUser([]);
            } catch (error) {
                console.error('Error al actualizar el usuario:', error);
                showErrorAlert('Cancelado','Ocurrió un error al actualizar el usuario.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUser,
        setDataUser
    };
};

export default useEditUser;