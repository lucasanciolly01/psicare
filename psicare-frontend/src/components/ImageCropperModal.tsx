// src/components/ImageCropperModal.tsx
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { type Point, type Area } from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (base64Image: string) => void;
}

export function ImageCropperModal({ imageSrc, onCancel, onSave }: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Chamado toda vez que o usuário move ou dá zoom na imagem
  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Chamado quando o usuário clica em "Salvar"
  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsLoading(true);
    try {
      // Chama a função utilitária para gerar a nova imagem
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImageBase64); // Envia a imagem final para o componente pai
    } catch (e) {
      console.error(e);
      alert('Erro ao cortar a imagem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in">
      <div className="bg-white rounded-xl overflow-hidden shadow-xl w-full max-w-md flex flex-col h-[500px]">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-gray-800">Ajustar Foto</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Área do Cropper */}
        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // Força o formato quadrado (1:1)
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            cropShape="round" // Mostra o guia circular
          />
        </div>

        {/* Controles e Botões */}
        <div className="p-4 bg-white space-y-4">
           {/* Controle de Zoom */}
          <div className="flex items-center gap-2 text-gray-500">
            <ZoomOut size={18} />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <ZoomIn size={18} />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading || !croppedAreaPixels}
              className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processando...' : <><Check size={18} /> Salvar Foto</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}