import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Root()  {
  return (
    <AuthProvider>
      <ScrollToTop />
      <PageRoot/>
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
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