import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PacientesProvider } from './context/PacientesContext';
import { AgendamentosProvider } from './context/AgendamentosContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificacoesProvider } from './context/NotificacoesContext';

// === CONFIGURAÇÃO DE IMPORTS (LAZY LOADING) ===

// 1. Componentes com Exportação NOMEADA (export function Nome)
// Precisam do adaptador: .then(module => ({ default: module.Nome }))
const MainLayout = lazy(() => import('./components/layout/MainLayout').then(module => ({ default: module.MainLayout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));

// Assumindo que as outras páginas internas seguem o padrão do Dashboard (Named Export):
const Agenda = lazy(() => import('./pages/Agenda').then(module => ({ default: module.Agenda })));
const Pacientes = lazy(() => import('./pages/Pacientes').then(module => ({ default: module.Pacientes })));
const Perfil = lazy(() => import('./pages/Perfil').then(module => ({ default: module.Perfil })));

// 2. Componentes com Exportação PADRÃO (export default function Nome)
// Importação direta
const Cadastro = lazy(() => import('./pages/Cadastro')); 

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PacientesProvider>
            <AgendamentosProvider>
              <NotificacoesProvider>
                {/* Fallback de Carregamento Centralizado */}
                <Suspense fallback={
                  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-primary font-bold text-lg animate-pulse">Carregando PsiCare...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    
                    {/* Rotas Protegidas (Layout Principal) */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="agenda" element={<Agenda />} />
                      <Route path="pacientes" element={<Pacientes />} />
                      <Route path="perfil" element={<Perfil />} />
                    </Route>
                  </Routes>
                </Suspense>
              </NotificacoesProvider>
            </AgendamentosProvider>
          </PacientesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;