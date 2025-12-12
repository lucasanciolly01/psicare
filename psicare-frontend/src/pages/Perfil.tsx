import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext"; // Hook do Toast
import { User, Phone, Mail, Save, Camera } from "lucide-react";

export function Perfil() {
  const { usuario, atualizarPerfil, atualizarFoto } = useAuth();
  const { addToast } = useToast(); // Instância do Toast

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTelefone(usuario.telefone);
    }
  }, [usuario]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      atualizarPerfil({ nome, email, telefone });
      // SUBSTITUIÇÃO DO ALERT
      addToast({
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Seus dados foram salvos com sucesso.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações.'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        atualizarFoto(e.target.files[0]);
        addToast({
          type: 'success',
          title: 'Foto atualizada',
          description: 'Sua nova foto de perfil foi salva.'
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro no upload',
          description: 'Falha ao processar a imagem.'
        });
      }
    }
  };

  if (!usuario) return null;

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-primary mb-6">Meu Perfil</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-50 to-primary/10"></div>

        <div className="px-6 md:px-8 pb-8">
          <div className="relative -mt-16 mb-8 flex justify-center md:justify-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {usuario.foto ? (
                  <img src={usuario.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-300">{usuario.iniciais}</span>
                )}
              </div>

              <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-green-700 shadow-lg transition-all hover:scale-105 active:scale-95" title="Alterar foto">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            <div className="flex justify-end">
              <button type="submit" className="w-full md:w-auto bg-primary hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95">
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