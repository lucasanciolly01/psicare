import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Agenda } from './pages/Agenda';
import { Pacientes } from './pages/Pacientes';
import { Perfil } from './pages/Perfil';
import { Cadastro } from './pages/Cadastro';
import { Login } from './pages/Login'; // Se você já criou a Login, importe aqui
// 1. IMPORTAÇÕES NOVAS
import { Termos } from './pages/Termos';
import { Privacidade } from './pages/Privacidade';

import { PacientesProvider } from './context/PacientesContext';
import { AgendamentosProvider } from './context/AgendamentosContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PacientesProvider>
          <AgendamentosProvider>
            <Routes>
              {/* Rotas Públicas (Sem Sidebar) */}
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} /> {/* Se não tiver o arquivo Login.tsx, mantenha o placeholder */}
              
              {/* 2. ROTAS NOVAS AQUI */}
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />

              {/* Rotas Privadas (Com Sidebar) */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="pacientes" element={<Pacientes />} />
                <Route path="perfil" element={<Perfil />} />
              </Route>
            </Routes>
          </AgendamentosProvider>
        </PacientesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;