import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';

export function Cadastro() {
  const { login } = useAuth(); // No mundo real, seria uma função 'register'
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    if (formData.senha !== formData.confirmacao) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!aceitouTermos) {
      setError('Você precisa aceitar os termos de uso.');
      return;
    }

    // Simula cadastro e login imediato
    login(formData.email);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
          <p className="text-gray-500 text-sm">Comece a gerenciar sua clínica hoje.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">{error}</div>}
          
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              required 
              type="text" 
              placeholder="Nome Completo"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              onChange={e => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              required 
              type="email" 
              placeholder="E-mail profissional"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              required 
              type="password" 
              placeholder="Senha"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              onChange={e => setFormData({...formData, senha: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              required 
              type="password" 
              placeholder="Confirme a senha"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all ${formData.senha && formData.confirmacao && formData.senha !== formData.confirmacao ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
              onChange={e => setFormData({...formData, confirmacao: e.target.value})}
            />
          </div>

          <div className="flex items-start gap-2">
            <input 
              type="checkbox" id="termos" 
              className="mt-1 rounded text-primary focus:ring-primary"
              checked={aceitouTermos}
              onChange={e => setAceitouTermos(e.target.checked)}
            />
            <label htmlFor="termos" className="text-xs text-gray-600 cursor-pointer">
              Li e aceito os <Link to="#" className="text-primary hover:underline">Termos de Uso</Link> e a <Link to="#" className="text-primary hover:underline">Política de Privacidade</Link>.
            </label>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
            Criar Conta
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline">Entrar</Link>
        </div>
      </div>
    </div>
  );
}