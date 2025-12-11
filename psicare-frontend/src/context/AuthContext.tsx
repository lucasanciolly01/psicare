import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('psicare_auth_v2');
    // Usuário padrão para testes
    return saved ? JSON.parse(saved) : {
      nome: 'Psicólogo Silva',
      email: 'doutor@psicare.com',
      telefone: '(11) 99999-9999',
      iniciais: 'PS'
    };
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
    window.location.href = '/login';
  };

  const atualizarPerfil = (dados: Partial<Usuario>) => {
    if (!usuario) return;
    
    // Recalcula iniciais se o nome mudar
    let novasIniciais = usuario.iniciais;
    if (dados.nome) {
      novasIniciais = dados.nome.substring(0, 2).toUpperCase();
    }

    setUsuario({ ...usuario, ...dados, iniciais: novasIniciais });
  };

  // Lógica Profissional de Upload de Foto (Convertendo para Base64)
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

export function useAuth() {
  return useContext(AuthContext);
}