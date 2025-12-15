import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login", { replace: true });
    }
  }, [usuario, navigate]);

  if (!usuario) return null;

  return (
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex h-full shadow-[1px_0_20px_rgba(0,0,0,0.03)] z-30 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar Mobile (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-secondary-900/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-72 bg-white h-[100dvh] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-900 hover:bg-secondary-100 rounded-full z-50 transition-all"
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
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-background">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth touch-pan-y">
          <div className="max-w-7xl mx-auto pb-24 md:pb-12 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
