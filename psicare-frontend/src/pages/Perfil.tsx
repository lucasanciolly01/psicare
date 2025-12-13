// src/pages/Perfil.tsx
import { useState, useEffect, type FormEvent, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Phone, Mail, Save, Camera, Trash2, AlertTriangle } from "lucide-react";
import { ImageCropperModal } from "../components/ImageCropperModal"; 

// Função auxiliar para formatar telefone (definida fora para performance)
const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  
  // 1. Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // 2. Limita a 11 dígitos (DDD + 9 dígitos)
  const truncated = numbers.slice(0, 11);

  // 3. Aplica a máscara progressivamente
  if (truncated.length <= 2) {
    return truncated.replace(/(\d{0,2})/, "($1");
  } else if (truncated.length <= 7) {
    return truncated.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    return truncated.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
};

export function Perfil() {
  const { usuario, atualizarPerfil, salvarFotoCortada, removerFoto } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // Estados para o Cropper (Corte de Imagem)
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // Estado para o Modal de Confirmação de Exclusão
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      // Formata o telefone ao carregar os dados do usuário
      setTelefone(formatPhoneNumber(usuario.telefone));
    }
  }, [usuario]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      // Salva os dados (removemos a formatação antes de enviar se o backend preferir apenas números, 
      // mas aqui mantivemos conforme o estado para consistência visual)
      atualizarPerfil({ nome, email, telefone });
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

  // Handler específico para formatar enquanto digita
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTelefone(formatted);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImageSrc(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCropperSave = (base64Image: string) => {
    try {
      salvarFotoCortada(base64Image);
      setShowCropper(false);
      setTempImageSrc(null);
      addToast({
        type: 'success',
        title: 'Foto atualizada',
        description: 'Sua nova foto de perfil foi ajustada e salva.'
      });
    } catch (error) {
      addToast({ type: 'error', title: 'Erro', description: 'Falha ao salvar a imagem.' });
    }
  };

  const confirmDeletePhoto = () => {
    removerFoto();
    setShowDeleteConfirm(false);
    addToast({
      type: 'info',
      title: 'Foto removida',
      description: 'Sua foto de perfil foi excluída com sucesso.'
    });
  };

  if (!usuario) return null;

  return (
    <div className="p-4 md:p-6 animate-fade-in relative">
      
      {/* 1. Modal do Cropper */}
      {showCropper && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onCancel={() => {
            setShowCropper(false);
            setTempImageSrc(null);
          }}
          onSave={handleCropperSave}
        />
      )}

      {/* 2. Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 transition-transform">
            
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">Remover foto?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Tem certeza que deseja remover sua foto de perfil? Esta ação voltará a exibir suas iniciais.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeletePhoto}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors"
                >
                  Sim, remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-primary mb-6">Meu Perfil</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-50 to-primary/10"></div>

        <div className="px-6 md:px-8 pb-8">
          <div className="relative -mt-16 mb-8 flex justify-center md:justify-start w-fit mx-auto md:mx-0">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center relative z-10">
                {usuario.foto ? (
                  <img src={usuario.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-300">{usuario.iniciais}</span>
                )}
              </div>

              <div className="absolute -bottom-2 -right-2 flex gap-2 z-20">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-white p-2.5 rounded-full cursor-pointer hover:bg-green-700 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center" 
                  title="Alterar foto"
                >
                  <Camera size={18} />
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onFileSelect} 
                  />
                </button>

                {usuario.foto && (
                   <button 
                   onClick={() => setShowDeleteConfirm(true)}
                   className="bg-white text-red-500 border border-red-100 p-2.5 rounded-full cursor-pointer hover:bg-red-50 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center" 
                   title="Remover foto"
                 >
                   <Trash2 size={18} />
                 </button>
                )}
              </div>
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
                    type="tel" // Alterado para 'tel' para abrir teclado numérico no mobile
                    value={telefone}
                    onChange={handlePhoneChange} // Usando o novo handler com máscara
                    maxLength={15} // Limite (11 dígitos + formatação)
                    placeholder="(00) 00000-0000"
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