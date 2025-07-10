import Table from '@/components/Table';
import useUsers from '@/hooks/users/useGetUsers.jsx';
import Search from '../components/Search';
import ProfilePopup from '../components/ProfilePopup';
import { MdDelete, MdEdit, MdEditOff, MdDeleteOutline } from 'react-icons/md';
import { useCallback, useState } from 'react';
// import '@styles/users.css';
import useEditUser from '@/hooks/users/useEditUser';
import useDeleteUser from '@/hooks/users/useDeleteUser';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

  const handleRutFilterChange = (e) => {
    setFilterRut(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedUsers) => {
    setDataUser(selectedUsers);
  }, [setDataUser]);

  const columns = [
    { title: "ID", field: "id", width: 150, responsive: 0 },
    { title: "Nombres", field: "nombres", width: 350, responsive: 0 },
    { title: "Apellidos", field: "apellidos", width: 350, responsive: 0 },
    { title: "Correo electrónico", field: "email", width: 300, responsive: 3 },
    { title: "Rut", field: "rut", width: 150, responsive: 2 },
    { title: "Rol", field: "rol", width: 200, responsive: 2 },
    { title: "Creado", field: "createdAt", width: 200, responsive: 2 }
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Usuarios</h1>
          <div className='filter-actions'>
            <Search value={filterRut} onChange={handleRutFilterChange} placeholder={'Filtrar por rut'} />
            <button onClick={handleClickUpdate} disabled={dataUser.length === 0}>
              {dataUser.length === 0 ? (
                <MdEditOff size={24} title="edit-disabled" />
              ) : (
                <MdEdit size={24} title="edit" />
              )}
            </button>
            <button className='delete-user-button' disabled={dataUser.length === 0} onClick={() => handleDelete(dataUser)}>
              {dataUser.length === 0 ? (
                <MdDeleteOutline size={24} title="delete-disabled" />
              ) : (
                <MdDelete size={24} title="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={users}
          columns={columns}
          filter={filterRut}
          dataToFilter={'rut'}
          initialSortName={'nombres'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <ProfilePopup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
    </div>
  );
};

export default Users;