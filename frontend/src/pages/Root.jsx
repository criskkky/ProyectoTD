import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import { AuthProvider } from '@context/AuthContext';

function Root()  {
return (
    <AuthProvider>
        <PageRoot/>
    </AuthProvider>
);
}

function PageRoot() {
return (
    <>
        <Navbar />
        <Outlet />
    </>
);
}

export default Root;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        button {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}