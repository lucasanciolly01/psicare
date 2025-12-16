import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PacientesProvider } from './context/PacientesContext';
import { AgendamentosProvider } from './context/AgendamentosContext';
import { NotificacoesProvider } from './context/NotificacoesContext';
import { MainLayout } from './components/layout/MainLayout';
import { PageLoader } from './components/ui/PageLoader';
import React from 'react';

// Mantendo a sintaxe de EXPORTAÇÃO NOMEADA (module.Nome) conforme exigido pelo seu compilador.
// Esta sintaxe será a correta se você mudar os arquivos de página para 'export function NomeComponente()'.
const Login = lazy(() => import('./pages/Login'));
const Cadastro = lazy(() => import('./pages/Cadastro'));
const RecuperarSenha = lazy(() => import('./pages/RecuperarSenha'));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Agenda = lazy(() => import('./pages/Agenda').then(module => ({ default: module.Agenda })));
const Pacientes = lazy(() => import('./pages/Pacientes').then(module => ({ default: module.Pacientes })));
const Perfil = lazy(() => import('./pages/Perfil'));
const Financeiro = lazy(() => import('./pages/Financeiro').then(module => ({ default: module.Financeiro })));
const Termos = lazy(() => import('./pages/Termos').then(module => ({ default: module.Termos })));
const Privacidade = lazy(() => import('./pages/Privacidade').then(module => ({ default: module.Privacidade })));
const NotFound = lazy(() => import('./pages/NotFound'));


// Wrapper para rotas protegidas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Wrapper para rotas públicas (usuário não logado)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }

  // Se o usuário estiver logado, redireciona para o dashboard
  if (usuario) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PacientesProvider>
            <AgendamentosProvider>
              <NotificacoesProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/cadastro" element={<PublicRoute><Cadastro /></PublicRoute>} />
                    <Route path="/recuperar-senha" element={<PublicRoute><RecuperarSenha /></PublicRoute>} />
                    
                    {/* Rotas de Documentação (Sempre acessíveis) */}
                    <Route path="/termos" element={<Termos />} />
                    <Route path="/privacidade" element={<Privacidade />} />
                    
                    {/* Rotas Protegidas */}
                    <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="agenda" element={<Agenda />} />
                      <Route path="pacientes" element={<Pacientes />} />
                      <Route path="perfil" element={<Perfil />} />
                      <Route path="financeiro" element={<Financeiro />} />
                    </Route>

                    {/* Rota 404 */}
                    <Route path="*" element={<NotFound />} />
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