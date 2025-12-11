import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Phone, Mail, Save, Camera } from "lucide-react";

export function Perfil() {
  const { usuario, atualizarPerfil, atualizarFoto } = useAuth();

  // Estados locais para o formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // Carrega os dados do contexto para os inputs quando a tela abre
  useEffect(() => {
    if (usuario) {
      setTimeout(() => {
        setNome(usuario.nome);
        setEmail(usuario.email);
        setTelefone(usuario.telefone);
      }, 0);
    }
  }, [usuario]); // <--- Dependência [usuario] adicionada

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Envia os dados atualizados para o Contexto Global
    atualizarPerfil({ nome, email, telefone });
    alert("Perfil atualizado com sucesso!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      atualizarFoto(e.target.files[0]);
    }
  };

  if (!usuario) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Meu Perfil</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Capa decorativa */}
        <div className="h-32 bg-gradient-to-r from-green-50 to-primary/10"></div>

        <div className="px-8 pb-8">
          {/* Foto de Perfil com Botão de Troca */}
          <div className="relative -mt-16 mb-8 flex justify-center md:justify-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {usuario.foto ? (
                  <img
                    src={usuario.foto}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-300">
                    {usuario.iniciais}
                  </span>
                )}
              </div>

              {/* Botão flutuante da câmera */}
              <label
                className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-green-700 shadow-lg transition-all"
                title="Alterar foto"
              >
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
