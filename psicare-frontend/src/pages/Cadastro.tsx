import React from 'react';
import { User, Mail, Lock, Check } from 'lucide-react'; // Certifique-se de ter lucide-react ou use seus próprios ícones

export default function Cadastro() {
  return (
    // CONTAINER PRINCIPAL (CORREÇÃO DE LAYOUT)
    // min-h-screen: Garante altura mínima de 100% da tela, mas permite crescer (rolagem).
    // py-12: Adiciona espaço seguro em cima e embaixo para nada ficar colado na borda.
    // flex-col justify-center: Centraliza verticalmente se sobrar espaço, mas respeita o fluxo se faltar.
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* CABEÇALHO DO LOGO (Psicare) */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Se tiver uma imagem de logo, coloque aqui */}
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Psicare
        </h2>
      </div>

      {/* CONTAINER DO CARD BRANCO */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* TÍTULO DA PÁGINA */}
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Crie sua conta
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Comece a gerenciar sua clínica hoje.
            </p>
          </div>

          {/* FORMULÁRIO */}
          <form className="space-y-6" action="#" method="POST">
            
            {/* Input: Nome Completo */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="Nome Completo"
                />
              </div>
            </div>

            {/* Input: E-mail */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="E-mail profissional"
                />
              </div>
            </div>

            {/* Input: Senha */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="Senha"
                />
              </div>
            </div>

             {/* Input: Confirmar Senha */}
             <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="Confirme a senha"
                />
              </div>
            </div>

            {/* Checkbox: Termos */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Li e aceito os <a href="#" className="text-emerald-600 hover:text-emerald-500">Termos de Uso</a> e a <a href="#" className="text-emerald-600 hover:text-emerald-500">Política de Privacidade</a>.
                </label>
              </div>
            </div>

            {/* Botão de Ação */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Criar Conta
              </button>
            </div>
          </form>

          {/* Rodapé: Link para Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Já tem conta? <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Entrar</a>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}