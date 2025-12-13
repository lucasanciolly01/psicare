// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Usuario } from '../types';

interface AuthContextData {
  usuario: Usuario | null;
  login: (email: string) => void;
  logout: () => void;
  atualizarPerfil: (dados: Partial<Usuario>) => void;
  // ATUALIZADO: Agora aceita a string base64 pronta
  salvarFotoCortada: (base64Image: string) => void;
  // NOVO: Função para remover
  removerFoto: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('psicare_auth_v2');
    // Use 'as Usuario' para garantir a tipagem correta ao recuperar
    return saved ? (JSON.parse(saved) as Usuario) : null; 
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('psicare_auth_v2', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('psicare_auth_v2');
    }
  }, [usuario]);

  const login = (email: string) => {
    // Mock data
    const novoUsuario: Usuario = {
      id: '1',
      nome: 'Psicólogo Silva',
      email,
      telefone: '(11) 99999-9999',
      iniciais: 'PS'
    };
    setUsuario(novoUsuario);
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

    setUsuario(prev => prev ? { ...prev, ...dados, iniciais: novasIniciais } : null);
  };

  // ATUALIZADO: Recebe a imagem já processada pelo cropper
  const salvarFotoCortada = (base64Image: string) => {
    if (!usuario) return;
    setUsuario(prev => prev ? { ...prev, foto: base64Image } : null);
  };

  // NOVO: Remove a propriedade foto
  const removerFoto = () => {
    if (!usuario) return;
    setUsuario(prev => {
        if (!prev) return null;
        // Cria uma cópia e remove a propriedade foto
        const { foto, ...rest } = prev; 
        return rest as Usuario;
    });
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, atualizarPerfil, salvarFotoCortada, removerFoto }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}