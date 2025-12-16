import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // <--- Removido 'Navigate'
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PacientesProvider } from './context/PacientesContext';
import { AgendamentosProvider } from './context/AgendamentosContext';
import { NotificacoesProvider } from './context/NotificacoesContext';

// Componentes Fixos
import { MainLayout } from './components/layout/MainLayout';
import { PageLoader } from './components/ui/PageLoader';
import { ScrollToTop } from './components/ScrollToTop';

// === Lazy Loading das Páginas ===
const Login = lazy(() => import('./pages/Login'));
const Cadastro = lazy(() => import('./pages/Cadastro'));
const RecuperarSenha = lazy(() => import('./pages/RecuperarSenha'));
const Termos = lazy(() => import('./pages/Termos').then(module => ({ default: module.Termos })));
const Privacidade = lazy(() => import('./pages/Privacidade').then(module => ({ default: module.Privacidade })));
const NotFound = lazy(() => import('./pages/NotFound'));

const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Agenda = lazy(() => import('./pages/Agenda').then(module => ({ default: module.Agenda })));
const Pacientes = lazy(() => import('./pages/Pacientes').then(module => ({ default: module.Pacientes })));
const Perfil = lazy(() => import('./pages/Perfil').then(module => ({ default: module.Perfil })));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <PacientesProvider>
            <AgendamentosProvider>
              <NotificacoesProvider>
                <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><PageLoader /></div>}>
                  <Routes>
                    {/* === Rotas Públicas === */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                    
                    <Route path="/termos" element={<Termos />} />
                    <Route path="/privacidade" element={<Privacidade />} />

                    {/* === Rotas Privadas === */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={
                        <Suspense fallback={<PageLoader />}>
                          <Dashboard />
                        </Suspense>
                      } />
                      <Route path="agenda" element={
                        <Suspense fallback={<PageLoader />}>
                          <Agenda />
                        </Suspense>
                      } />
                      <Route path="pacientes" element={
                        <Suspense fallback={<PageLoader />}>
                          <Pacientes />
                        </Suspense>
                      } />
                      <Route path="perfil" element={
                        <Suspense fallback={<PageLoader />}>
                          <Perfil />
                        </Suspense>
                      } />
                    </Route>

                    {/* Rota 404 (Catch-all) */}
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