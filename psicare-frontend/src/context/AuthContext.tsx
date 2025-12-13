import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Usuario } from '../types';

interface AuthContextData {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  atualizarPerfil: (dados: Partial<Usuario>) => void;
  salvarFotoCortada: (base64Image: string) => void;
  removerFoto: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('psicare_auth_v2');
    return saved ? (JSON.parse(saved) as Usuario) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('psicare_auth_v2', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('psicare_auth_v2');
    }
  }, [usuario]);

  const login = async (email: string) => {
    try {
      // UX: Simula um delay de rede para que o spinner de loading apareça na tela
      await new Promise(resolve => setTimeout(resolve, 1000));

      // SEGURANÇA: Log apenas informativo, NUNCA logar a senha (senha removida daqui)
      console.log(`[Auth] Tentativa de login simulado para: ${email}`);

      /* * NOTA DE ARQUITETURA:
       * Como ainda não há Backend real, mantivemos o Mock.
       * Para produção real (com dados sensíveis), substitua o bloco abaixo por:
       * const response = await api.post('/sessions', { email, senha });
       * setUsuario(response.data.user);
       */

      // Mock de Usuário para Demonstração
      const usuarioMock: Usuario = {
        id: '1',
        nome: 'Psicólogo Silva', // Em um app real, viria do banco de dados
        email,
        telefone: '(11) 99999-9999',
        iniciais: 'PS',
      };

      setUsuario(usuarioMock);
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error; // Importante: relança o erro para o componente de Login exibir o Toast de erro
    }
  };

  const logout = () => {
    setUsuario(null);
    navigate('/login');
  };

  const atualizarPerfil = (dados: Partial<Usuario>) => {
    if (!usuario) return;

    let novasIniciais = usuario.iniciais;
    if (dados.nome) {
      novasIniciais = dados.nome.substring(0, 2).toUpperCase();
    }

    setUsuario(prev =>
      prev ? { ...prev, ...dados, iniciais: novasIniciais } : null
    );
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
      // Adicionamos ': _' para renomear a variável 'foto' para '_' (descarte)
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