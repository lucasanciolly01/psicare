import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PacientesProvider } from './context/PacientesContext';
import { AgendamentosProvider } from './context/AgendamentosContext';
import { NotificacoesProvider } from './context/NotificacoesContext';

// Layouts
import { MainLayout } from './components/layout/MainLayout';

// Pages - Públicas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha'; // <--- Importação adicionada
import { Termos } from './pages/Termos';
import { Privacidade } from './pages/Privacidade';

// Pages - Privadas
import { Dashboard } from './pages/Dashboard';
import { Agenda } from './pages/Agenda';
import { Pacientes } from './pages/Pacientes';
import { Perfil } from './pages/Perfil';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PacientesProvider>
            <AgendamentosProvider>
              <NotificacoesProvider>
                <Routes>
                  {/* === Rotas Públicas === */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/recuperar-senha" element={<RecuperarSenha />} /> {/* <--- Rota adicionada */}
                  
                  <Route path="/termos" element={<Termos />} />
                  <Route path="/privacidade" element={<Privacidade />} />

                  {/* === Rotas Privadas (Dentro do Layout Principal) === */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="agenda" element={<Agenda />} />
                    <Route path="pacientes" element={<Pacientes />} />
                    <Route path="perfil" element={<Perfil />} />
                  </Route>

                  {/* Fallback para rotas desconhecidas */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </NotificacoesProvider>
            </AgendamentosProvider>
          </PacientesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}