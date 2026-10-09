import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, RotateCcw, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Language } from '../types';
import {
  LogoState,
  DEFAULT_LOGO_URL,
  saveLogoState,
  resetToDefaultLogo,
  removeLogo,
  setCustomLogo,
} from '../utils/logoManager';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  logoState: LogoState;
}

export const LogoModal: React.FC<LogoModalProps> = ({
  isOpen,
  onClose,
  lang,
  logoState,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'gu' ? 'કૃપા કરીને માત્ર ફોટો/ઇમેજ ફાઇલ પસંદ કરો.' : 'Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPreviewUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustom = () => {
    if (previewUrl) {
      setCustomLogo(previewUrl);
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleRemoveLogo = () => {
    removeLogo();
    setPreviewUrl(null);
    onClose();
  };

  const handleResetDefault = () => {
    resetToDefaultLogo();
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {lang === 'gu' ? 'લોગો સેટિંગ્સ (Add / Remove Logo)' : 'Logo Settings (Add / Remove Logo)'}
              </h3>
              <p className="text-xs text-neutral-400">
                {lang === 'gu' ? 'બ્રાન્ડ લોગો બદલો, નવો ઉમેરો અથવા કાઢી નાખો' : 'Change, upload new, or remove brand logo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Current Logo Preview */}
          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {lang === 'gu' ? 'હાલનો લોગો પ્રિવ્યૂ' : 'Current Logo Preview'}
            </span>
            
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 flex items-center justify-center overflow-hidden p-1 relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="New Logo Preview"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : logoState.mode === 'none' ? (
                <div className="flex flex-col items-center justify-center text-center p-2 text-neutral-500">
                  <span className="text-[10px] font-bold">NO LOGO</span>
                  <span className="text-[9px] text-neutral-600">(દૂર કરેલ)</span>
                </div>
              ) : logoState.mode === 'custom' && logoState.customUrl ? (
                <img
                  src={logoState.customUrl}
                  alt="Custom Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src={DEFAULT_LOGO_URL}
                  alt="Official Gurudev Creative Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="text-xs text-center text-neutral-300 font-medium">
              {previewUrl ? (
                <span className="text-amber-400 font-semibold">
                  {lang === 'gu' ? '✨ નવો પસંદ કરેલો લોગો (લાગુ કરવા તૈયાર)' : '✨ New logo selected (ready to apply)'}
                </span>
              ) : logoState.mode === 'none' ? (
                <span className="text-rose-400 font-semibold">
                  {lang === 'gu' ? '❌ લોગો દૂર કરેલ છે (માત્ર ટેક્સ્ટ દેખાશે)' : '❌ Logo removed (Wordmark only)'}
                </span>
              ) : logoState.mode === 'custom' ? (
                <span className="text-emerald-400 font-semibold">
                  {lang === 'gu' ? '✓ તમારો કસ્ટમ લોગો સક્રિય છે' : '✓ Custom logo active'}
                </span>
              ) : (
                <span className="text-amber-300 font-semibold">
                  {lang === 'gu' ? '★ Gurudev Creative ઑફિશિયલ લોગો' : '★ Gurudev Creative Official Logo'}
                </span>
              )}
            </div>
          </div>

          {/* Action 1: Upload / Add Logo */}
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 hover:scale-[1.01]"
            >
              <Upload className="w-4 h-4" />
              <span>
                {lang === 'gu' ? 'નવો લોગો ઉમેરો / અપલોડ કરો (Add Logo)' : 'Upload New Logo (Add Logo)'}
              </span>
            </button>

            {previewUrl && (
              <button
                onClick={handleApplyCustom}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all text-xs"
              >
                <Check className="w-4 h-4" />
                <span>
                  {lang === 'gu' ? 'નવો લોગો સેવ કરો (Save Logo)' : 'Save & Apply This Logo'}
                </span>
              </button>
            )}
          </div>

          {/* Action 2: Remove Logo & Reset Default */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
            <button
              onClick={handleRemoveLogo}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-semibold text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                {lang === 'gu' ? 'લોગો દૂર કરો (Remove)' : 'Remove Logo'}
              </span>
            </button>

            <button
              onClick={handleResetDefault}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {lang === 'gu' ? 'મૂળ લોગો (Default)' : 'Reset Default'}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
