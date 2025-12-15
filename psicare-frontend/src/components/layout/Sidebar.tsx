// src/components/layout/Sidebar.tsx
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Settings,
  DollarSign, // <--- Importado
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Início", path: "/" },
    { icon: Calendar, label: "Agenda", path: "/agenda" },
    { icon: Users, label: "Pacientes", path: "/pacientes" },
    { icon: DollarSign, label: "Financeiro", path: "/financeiro" }, // <--- Novo Item
  ];

  const handleLinkClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-full md:w-[280px] bg-white border-r border-secondary-200 h-full flex flex-col z-20 relative font-sans">
      {/* Brand Area */}
      <div className="p-6 md:p-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">
              PsiCare
            </h1>
            <p className="text-[10px] font-semibold text-secondary-400 uppercase tracking-widest mt-1">
              Prática Profissional
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar py-2">
        <p className="px-4 text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3 select-none">
          Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleLinkClick}
                end={item.path === "/"}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 font-medium"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                    )}
                    <item.icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`transition-colors ${
                        isActive
                          ? "text-primary-600"
                          : "text-secondary-400 group-hover:text-secondary-600"
                      }`}
                    />
                    <span className="text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 m-4 bg-secondary-50 rounded-2xl border border-secondary-100 flex-shrink-0">
        <NavLink
          to="/perfil"
          onClick={handleLinkClick}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1 text-sm font-medium
            ${
              isActive
                ? "bg-white text-primary-700 shadow-sm"
                : "text-secondary-600 hover:bg-white hover:text-secondary-900 hover:shadow-sm"
            }
          `}
        >
          {({ isActive }) => (
            <>
              <Settings
                size={18}
                className={isActive ? "text-primary-600" : "text-secondary-400"}
              />
              Configurações
            </>
          )}
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 w-full rounded-lg transition-colors text-sm font-medium mt-1"
        >
          <LogOut size={18} className="opacity-80" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}