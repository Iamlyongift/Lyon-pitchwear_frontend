import Navbar from './Navbar';
import Footer from './Footer';

// Layout wraps every page — Navbar on top, Footer on bottom
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;