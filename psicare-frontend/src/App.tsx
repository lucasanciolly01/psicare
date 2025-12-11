import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PacientesProvider } from './context/PacientesContext';
import { AgendamentosProvider } from './context/AgendamentosContext';
import { AuthProvider } from './context/AuthContext';

// Lazy Imports
const MainLayout = lazy(() => import('./components/layout/MainLayout').then(m => ({ default: m.MainLayout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Agenda = lazy(() => import('./pages/Agenda').then(m => ({ default: m.Agenda })));
const Pacientes = lazy(() => import('./pages/Pacientes').then(m => ({ default: m.Pacientes })));
const Perfil = lazy(() => import('./pages/Perfil').then(m => ({ default: m.Perfil })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Cadastro = lazy(() => import('./pages/Cadastro').then(m => ({ default: m.Cadastro })));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PacientesProvider>
          <AgendamentosProvider>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando PsiCare...</div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="agenda" element={<Agenda />} />
                  <Route path="pacientes" element={<Pacientes />} />
                  <Route path="perfil" element={<Perfil />} />
                </Route>
              </Routes>
            </Suspense>
          </AgendamentosProvider>
        </PacientesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;