import React, { useState } from 'react';
import { X, Lock, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { checkAdminPassword, setAdminAuthenticated } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (checkAdminPassword(password)) {
      setAdminAuthenticated(true);
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg(
        lang === 'gu'
          ? 'ખોટો એડમિન પાસવર્ડ! કૃપા કરીને સાચો પાસવર્ડ નાખો.'
          : 'Incorrect admin password! Please try again.'
      );
    }
  };

  const handleQuickDemoFill = () => {
    setPassword('gurudev@002');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'gu' ? 'એડમિન લૉગિન (Admin Only)' : 'Admin Portal Login'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                Gurudev Creative_002 Management
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="text-xs text-neutral-400 leading-relaxed">
            {lang === 'gu'
              ? 'આ પેનલ ફક્ત ગુરુદેવ ક્રિએટિવ એડમિન માટે છે. ઓર્ડર મેનેજ કરવા, સ્ટેટસ અપડેટ કરવા અને ફાઇનલ વિડિયો ડિલિવર કરવા માટે લૉગિન કરો.'
              : 'Restricted to Gurudev Creative admins. Manage all incoming video orders, upload final deliverables, and update project statuses.'}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {lang === 'gu' ? 'એડમિન પાસવર્ડ (Admin Password) *' : 'Admin Security Key *'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Helper Hint */}
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
            <span>
              {lang === 'gu' ? 'ડેમો પાસવર્ડ: ' : 'Demo Password: '}
              <code className="text-amber-400 font-mono">gurudev@002</code>
            </span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-amber-400 hover:underline font-medium"
            >
              {lang === 'gu' ? 'ઓટો ભરો' : 'Fill'}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
            >
              {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'એડમિન લૉગિન' : 'Access Admin'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
