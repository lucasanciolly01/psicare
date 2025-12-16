import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { type Point, type Area } from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';

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

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsLoading(true);
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImageBase64); 
    } catch (e) {
      console.error(e);
      alert('Erro ao processar imagem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md flex flex-col h-[550px] animate-scale-in">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-secondary-100 bg-white">
          <h3 className="font-bold text-secondary-900 flex items-center gap-2">
            <ImageIcon size={18} className="text-primary-600" />
            Ajustar Foto
          </h3>
          <button 
            onClick={onCancel} 
            className="p-2 -mr-2 text-secondary-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área do Cropper */}
        <div className="relative flex-1 bg-secondary-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} 
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            cropShape="round"
            classes={{
               containerClassName: 'bg-secondary-900',
               mediaClassName: '',
               cropAreaClassName: 'border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]'
            }}
          />
        </div>

        {/* Controles */}
        <div className="p-6 bg-white space-y-6">
           {/* Slider de Zoom */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-secondary-500 uppercase tracking-wide">
               <span>Zoom</span>
               <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-3 text-secondary-400">
              <ZoomOut size={18} />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary-100 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700"
              />
              <ZoomIn size={18} />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-3 border border-secondary-200 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors font-bold disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading || !croppedAreaPixels}
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2 transition-colors font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : <><Check size={18} strokeWidth={2.5} /> Confirmar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}