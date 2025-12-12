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
    // FIX: overflow-hidden no container principal garante que apenas o 'main' tenha scroll
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-background font-sans">
      
      {/* Sidebar Desktop - flex-shrink-0 impede que encolha */}
      <div className="hidden md:flex h-full shadow-xl z-30 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar Mobile (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          <div className="relative w-72 bg-white h-[100dvh] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-lg z-50 transition-colors"
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
        
        {/* FIX: overflow-y-auto aqui gerencia o scroll da página. 
            overflow-x-hidden evita scroll horizontal indesejado.
            pb-24 garante espaço no final para mobile. */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth touch-pan-y">
          <div className="max-w-7xl mx-auto pb-24 md:pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}