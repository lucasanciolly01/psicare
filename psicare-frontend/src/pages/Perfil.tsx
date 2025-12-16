import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { ImageCropperModal } from "../components/ImageCropperModal";

// Função local de formatação
const formatPhone = (value: string) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

// Schema de Validação
const perfilSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido").optional(),
    telefone: z.string().optional(),
    senhaAtual: z.string().optional(),
    novaSenha: z.string().optional(),
    confirmarSenha: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.novaSenha && data.novaSenha.length < 6) return false;
      return true;
    },
    {
      message: "A nova senha deve ter no mínimo 6 caracteres",
      path: ["novaSenha"],
    }
  )
  .refine(
    (data) => {
      if (data.novaSenha !== data.confirmarSenha) return false;
      return true;
    },
    {
      message: "As senhas não conferem",
      path: ["confirmarSenha"],
    }
  );

type PerfilFormData = z.infer<typeof perfilSchema>;

export default function Perfil() {
  const { usuario, atualizarPerfil, removerFoto } = useAuth();

  // Inicialização do estado de foto direto no useState para evitar o setState no useEffect
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    usuario?.foto || null
  );
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: usuario?.nome || "",
      email: usuario?.email || "",
      telefone: usuario?.telefone || "",
    },
  });

  // Sincroniza dados do usuário com o formulário (sem a foto, pois setPreviewUrl está no useState)
  useEffect(() => {
    if (usuario) {
      setValue("nome", usuario.nome);
      setValue("email", usuario.email);
      setValue("telefone", usuario.telefone || "");
    }
  }, [usuario, setValue]);

  // === HANDLERS DE IMAGEM ===
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleCropComplete = (croppedImage: string) => {
    setPreviewUrl(croppedImage);
    setIsCropperOpen(false);
  };

  const handleRemoverFoto = () => {
    setPreviewUrl(null);
    removerFoto();
  };

  // === SUBMIT ===
  const onSubmit = async (data: PerfilFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        nome: data.nome,
        telefone: data.telefone,
        foto: previewUrl || "",
      };

      if (data.novaSenha) {
        payload.senha = data.novaSenha;
      }

      await atualizarPerfil(payload);

      setValue("senhaAtual", "");
      setValue("novaSenha", "");
      setValue("confirmarSenha", "");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
            Meu Perfil
          </h1>
          <p className="text-secondary-500 mt-1">
            Gerencie suas informações pessoais e credenciais de acesso.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA ESQUERDA: FOTO E INFO RÁPIDA */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary-100 border-4 border-white shadow-lg ring-1 ring-secondary-200">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-3xl font-bold">
                    {usuario?.iniciais}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
              >
                <Camera className="text-white" size={28} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <h2 className="text-xl font-bold text-secondary-900">
              {usuario?.nome}
            </h2>
            <p className="text-sm text-secondary-500 font-medium">
              Psicólogo(a) Clínico(a)
            </p>

            <div className="flex gap-2 mt-6 w-full">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-xs font-bold rounded-xl transition-colors border border-secondary-200"
              >
                <Upload size={14} /> Alterar Foto
              </button>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoverFoto}
                  className="flex items-center justify-center px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-100"
                  title="Remover foto"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 md:p-8 rounded-2xl border border-secondary-100 shadow-sm space-y-8"
          >
            {/* Seção Dados Pessoais */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-secondary-100">
                <User size={16} className="text-primary-500" />
                Informações Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                    Nome Completo
                  </label>
                  <div className="relative group">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors"
                    />
                    <input
                      {...register("nome")}
                      type="text"
                      className="w-full pl-10 pr-4 h-11 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-secondary-900 bg-white text-sm font-medium"
                      placeholder="Seu nome"
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-xs text-rose-500 font-bold mt-1">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                    E-mail
                  </label>
                  <div className="relative group">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      {...register("email")}
                      disabled
                      type="email"
                      className="w-full pl-10 pr-4 h-11 border border-secondary-200 rounded-xl bg-secondary-50 text-secondary-500 text-sm font-medium cursor-not-allowed select-none"
                    />
                  </div>
                  <p className="text-[10px] text-secondary-400 mt-1">
                    O e-mail não pode ser alterado.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                    Telefone / WhatsApp
                  </label>
                  <div className="relative group">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors"
                    />
                    <input
                      {...register("telefone", {
                        onChange: (e) => {
                          e.target.value = formatPhone(e.target.value);
                        },
                      })}
                      type="tel"
                      className="w-full pl-10 pr-4 h-11 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-secondary-900 bg-white text-sm font-medium"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Segurança */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-secondary-100 pt-4">
                <Lock size={16} className="text-primary-500" />
                Alterar Senha
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                    Nova Senha
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors"
                    />
                    <input
                      {...register("novaSenha")}
                      type="password"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 h-11 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-secondary-900 bg-white text-sm font-medium placeholder:text-secondary-300"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  {errors.novaSenha && (
                    <p className="text-xs text-rose-500 font-bold mt-1">
                      {errors.novaSenha.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors"
                    />
                    <input
                      {...register("confirmarSenha")}
                      type="password"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 h-11 border border-secondary-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-secondary-900 bg-white text-sm font-medium placeholder:text-secondary-300"
                      placeholder="Repita a senha"
                    />
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-xs text-rose-500 font-bold mt-1">
                      {errors.confirmarSenha.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rodapé do Form */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-secondary-100">
              {isDirty && (
                <span className="text-xs text-secondary-400 font-medium animate-fade-in mr-2">
                  Você tem alterações não salvas
                </span>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-200 disabled:text-secondary-400 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Recorte de Imagem */}
      {isCropperOpen && (
        <ImageCropperModal
          imageSrc={selectedImage || ""}
          onCancel={() => setIsCropperOpen(false)}
          onSave={handleCropComplete}
        />
      )}
    </div>
  );
}
