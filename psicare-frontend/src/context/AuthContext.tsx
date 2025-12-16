import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Usuario } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';
import { AxiosError } from 'axios';

interface AuthContextData {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  // ATUALIZADO: Aceita senha e retorna Promise
  atualizarPerfil: (dados: Partial<Usuario> & { senha?: string }) => Promise<void>;
  salvarFotoCortada: (base64Image: string) => void;
  removerFoto: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('psicare_auth_v2');
    return saved ? (JSON.parse(saved) as Usuario) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('psicare_auth_v2', JSON.stringify(usuario));
      
      const usuarioComToken = usuario as Usuario & { token?: string };
      
      if (usuarioComToken.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${usuarioComToken.token}`;
      }
    } else {
      localStorage.removeItem('psicare_auth_v2');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [usuario]);

  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      const response = await api.post('/login', { email, senha });

      const { token, id, nome, iniciais, telefone } = response.data;

      const usuarioLogado = {
        id,
        nome,
        email,
        token,
        iniciais,
        telefone: telefone || '', 
        foto: undefined
      } as Usuario;

      setUsuario(usuarioLogado);
      addToast({ type: 'success', title: 'Login realizado com sucesso!' });
      
      setTimeout(() => navigate('/dashboard'), 100);

    } catch (error) {
      console.error('Erro ao realizar login:', error);
      
      const err = error as AxiosError;
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        addToast({ type: 'error', title: 'E-mail ou senha incorretos.' });
      } else {
        addToast({ type: 'error', title: 'Erro ao conectar com o servidor.' });
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    navigate('/login');
    addToast({ type: 'info', title: 'Você saiu do sistema.' });
  };

  // ATUALIZADO: Conectado ao Backend
  const atualizarPerfil = async (dados: Partial<Usuario> & { senha?: string }) => {
    if (!usuario) return;

    try {
      setLoading(true);
      
      // Chama o Backend
      const response = await api.put('/usuarios', {
        nome: dados.nome,
        telefone: dados.telefone,
        senha: dados.senha // Opcional
      });
      
      // O Backend devolve o usuário atualizado
      const usuarioAtualizado = response.data;

      // Atualiza o estado local mantendo o token e outros campos não retornados
      setUsuario(prev => 
        prev ? { ...prev, ...usuarioAtualizado, token: prev.token } : null
      );

      addToast({ type: 'success', title: 'Perfil atualizado com sucesso!' });
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      addToast({ type: 'error', title: 'Erro ao atualizar dados.' });
    } finally {
      setLoading(false);
    }
  };

  const salvarFotoCortada = (base64Image: string) => {
    if (!usuario) return;
    setUsuario(prev =>
      prev ? { ...prev, foto: base64Image } : null
    );
  };

  const removerFoto = () => {
    if (!usuario) return;
    setUsuario(prev => {
      if (!prev) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { foto: _, ...rest } = prev;
      return rest as Usuario;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        atualizarPerfil,
        salvarFotoCortada,
        removerFoto,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}