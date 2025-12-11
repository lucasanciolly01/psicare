import { LayoutDashboard, Calendar, Users, LogOut, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // Mudamos de Link para NavLink
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/' },
    { icon: Calendar, label: 'Agenda', path: '/agenda' },
    { icon: Users, label: 'Pacientes', path: '/pacientes' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative flex-shrink-0">
      
      {/* Logo Area */}
      <div className="p-8 pb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2 tracking-tight">
          💚 PsiCare
        </h1>
        <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider ml-1">
          Sua prática profissional
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-2">
          Menu Principal
        </p>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'} // TRUQUE SÊNIOR: Garante que o '/' só ativa na home exata
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-green-200 translate-x-1' 
                    : 'text-gray-500 hover:bg-green-50 hover:text-primary hover:translate-x-1'
                  }
                `}
              >
                {/* Renderização condicional do ícone baseada no estado do link */}
                {({ isActive }) => (
                  <>
                    <item.icon 
                      size={22} 
                      className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} 
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-50 mt-auto">
        <NavLink 
          to="/perfil" 
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-1 font-medium
            ${isActive 
              ? 'bg-primary text-white shadow-lg shadow-green-200' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
          `}
        >
          {({ isActive }) => (
            <>
              <Settings size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              Configurações
            </>
          )}
        </NavLink>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors font-medium hover:translate-x-1 duration-200"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}