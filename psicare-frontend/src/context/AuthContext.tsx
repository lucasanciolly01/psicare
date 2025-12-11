import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  nome: string;
  email: string;
  telefone: string;
  foto?: string; // Base64 da imagem
  iniciais: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  login: (email: string) => void;
  logout: () => void;
  atualizarPerfil: (dados: Partial<Usuario>) => void;
  atualizarFoto: (file: File) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // CORREÇÃO: Inicializa como null se não houver dados salvos (removemos o mock)
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('psicare_auth_v2');
    return saved ? JSON.parse(saved) : null; 
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('psicare_auth_v2', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('psicare_auth_v2');
    }
  }, [usuario]);

  const login = (email: string) => {
    setUsuario({
      nome: 'Psicólogo Silva',
      email,
      telefone: '(11) 99999-9999',
      iniciais: 'PS'
    });
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('psicare_auth_v2');
    navigate('/login');
  };

  const atualizarPerfil = (dados: Partial<Usuario>) => {
    if (!usuario) return;
    
    let novasIniciais = usuario.iniciais;
    if (dados.nome) {
      novasIniciais = dados.nome.substring(0, 2).toUpperCase();
    }

    setUsuario({ ...usuario, ...dados, iniciais: novasIniciais });
  };

  const atualizarFoto = (file: File) => {
    if (!usuario) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUsuario({ ...usuario, foto: base64String });
    };
    reader.readAsDataURL(file);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, atualizarPerfil, atualizarFoto }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}