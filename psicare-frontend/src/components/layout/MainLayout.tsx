// src/components/layout/MainLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/login', { replace: true });
    }
  }, [usuario, navigate]);

  if (!usuario) return null;

  return (
    // MUDANÇA 1: Voltamos para h-screen com overflow-hidden para travar a rolagem do fundo
    <div className="flex flex-row h-screen w-screen overflow-hidden bg-background font-sans">
      
      {/* Sidebar Desktop */}
      <div className="hidden md:flex h-full shadow-xl z-30">
        <Sidebar />
      </div>

      {/* Sidebar Mobile (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Fundo Preto */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          {/* Menu Deslizante */}
          {/* MUDANÇA 2: h-full para ocupar toda a altura do container fixo */}
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-lg z-50"
            >
              <X size={20} />
            </button>
            
            <div className="h-full flex flex-col">
               <Sidebar mobile onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-gray-50/50">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}