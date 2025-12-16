import { useState, useEffect, type FormEvent, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Phone, Mail, Save, Camera, Trash2 } from "lucide-react";
import { ImageCropperModal } from "../components/ImageCropperModal"; 

const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  const truncated = numbers.slice(0, 11);

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

  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (usuario) {
      if (usuario.nome !== nome) setNome(usuario.nome);
      if (usuario.email !== email) setEmail(usuario.email);
      const telFormatado = formatPhoneNumber(usuario.telefone);
      if (telFormatado !== telefone) setTelefone(telFormatado);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      atualizarPerfil({ nome, email, telefone });
      addToast({
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Seus dados foram salvos com sucesso.'
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações.'
      });
    }
  };

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
        description: 'Sua nova foto de perfil foi salva.'
      });
    } catch {
      addToast({ type: 'error', title: 'Erro', description: 'Falha ao salvar a imagem.' });
    }
  };

  const confirmDeletePhoto = () => {
    removerFoto();
    setShowDeleteConfirm(false);
    addToast({
      type: 'info',
      title: 'Foto removida',
      description: 'Sua foto de perfil foi excluída.'
    });
  };

  if (!usuario) return null;

  return (
    <div className="p-0 md:p-2 animate-fade-in relative max-w-4xl mx-auto">
      
      {/* Modais */}
      {showCropper && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onCancel={() => { setShowCropper(false); setTempImageSrc(null); }}
          onSave={handleCropperSave}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-secondary-900/40 p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 transition-transform border border-secondary-100">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-rose-50/50">
                <Trash2 className="text-rose-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Remover foto?</h3>
              <p className="text-secondary-500 text-sm mb-6 leading-relaxed">
                Você voltará a usar as iniciais do seu nome como avatar. Essa ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-secondary-200 text-secondary-700 rounded-xl hover:bg-secondary-50 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeletePhoto}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-bold shadow-lg shadow-rose-200 transition-colors"
                >
                  Sim, remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header da Página */}
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Configurações de Perfil</h1>
         <p className="text-secondary-500 text-sm font-medium">Gerencie suas informações pessoais e aparência.</p>
      </div>

      <div className="bg-surface rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
        {/* Banner Decorativo */}
        <div className="h-40 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-10">
          
          {/* Avatar Section */}
          <div className="relative -mt-20 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <div className="w-36 h-36 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-secondary-100 flex items-center justify-center relative z-10">
                {usuario.foto ? (
                  <img src={usuario.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-secondary-400">{usuario.iniciais}</span>
                )}
              </div>
              
              {/* Botões do Avatar */}
              <div className="absolute bottom-1 right-0 flex gap-2 z-20">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-secondary-900 text-white p-2.5 rounded-full cursor-pointer hover:bg-primary-600 shadow-lg ring-4 ring-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center" 
                  title="Alterar foto"
                >
                  <Camera size={16} strokeWidth={2.5} />
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
                </button>
                {usuario.foto && (
                   <button 
                   onClick={() => setShowDeleteConfirm(true)}
                   className="bg-white text-rose-500 border border-secondary-200 p-2.5 rounded-full cursor-pointer hover:bg-rose-50 shadow-md transition-all hover:scale-110 active:scale-95 flex items-center justify-center" 
                   title="Remover foto"
                 >
                   <Trash2 size={16} />
                 </button>
                )}
              </div>
            </div>

            <div className="text-center md:text-left pb-2">
               <h2 className="text-2xl font-bold text-secondary-900">{usuario.nome}</h2>
               <p className="text-secondary-500 font-medium flex items-center gap-1.5 justify-center md:justify-start">
                 <Mail size={14} /> {usuario.email}
               </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wide ml-1">Nome Completo</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wide ml-1">Telefone</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="tel"
                    value={telefone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    placeholder="(00) 00000-0000"
                    className="w-full pl-11 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wide ml-1">E-mail de Acesso</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-secondary-100 flex justify-end">
              <button 
                type="submit" 
                className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Save size={18} strokeWidth={2.5} />
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}