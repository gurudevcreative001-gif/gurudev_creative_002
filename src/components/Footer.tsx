import React from 'react';
import { Video, Shield, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
  onOpenTrackModal: () => void;
  onOpenOrderModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAdmin,
  onOpenTrackModal,
  onOpenOrderModal,
}) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Gurudev Creative<span className="text-amber-400">_002</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed">
              {lang === 'gu'
                ? 'પ્રીમિયમ વિડિયો એડિટિંગ સર્વિસ — ઇન્સ્ટાગ્રામ રીલ્સ, યુટ્યુબ વ્લોગ્સ, કોમર્શિયલ એડ્સ અને સિનેમેટિક વેડિંગ હાઇલાઇટ્સ. માત્ર ₹150 થી ₹2000 ના પારદર્શક ભાવે ઝડપી ડિલિવરી.'
                : 'Full-service post-production studio for Instagram Reels, YouTube Vlogs, Commercial Ads & Cinematic Weddings. Transparent rates from ₹150 to ₹2000 with live order tracking.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Gujarat, India</span>
              </span>
              <span>·</span>
              <span className="font-mono text-amber-400">
                {lang === 'gu' ? 'ભાવ: ₹150 થી ₹2000' : 'Rates: ₹150 - ₹2000'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'gu' ? 'ઝડપી લિંક્સ' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenOrderModal}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'gu' ? 'નવો ઓર્ડર આપો' : 'Place Video Order'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackModal}
                  className="hover:text-amber-400 transition-colors"
                >
                  {lang === 'gu' ? 'ઓર્ડર સ્ટેટસ ટ્રેકિંગ' : 'Track Order Status'}
                </button>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'ભાવ અને પેકેજ (₹150 - ₹2000)' : 'Pricing Packages'}
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'સ્માર્ટ ભાવ કેલ્ક્યુલેટર' : 'Price Calculator'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'gu' ? 'WhatsApp સપોર્ટ (3 નંબર્સ)' : 'WhatsApp Support (3 Lines)'}
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/916353894486"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>+91 6353894486</span>
                <span className="text-[10px] text-emerald-500 font-sans">(Main)</span>
              </a>

              <a
                href="https://wa.me/91990940414"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>+91 990940414</span>
              </a>

              <a
                href="https://wa.me/919714171301"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>+91 9714171301</span>
              </a>

              <div className="flex items-center gap-2 text-neutral-400 pt-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>gurudevcreative002@gmail.com</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'gu' ? 'ફક્ત એડમિન લૉગિન' : 'Admin Login'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div>
            © {new Date().getFullYear()} Gurudev Creative_002. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{lang === 'gu' ? 'વિડિયો એડિટિંગ' : 'Video Editing'}</span>
            <span>·</span>
            <span>{lang === 'gu' ? 'રીલ્સ & શોર્ટ્સ' : 'Reels & Shorts'}</span>
            <span>·</span>
            <span>{lang === 'gu' ? 'સિનેમેટિક વેડિંગ' : 'Wedding Highlights'}</span>
            <span>·</span>
            <span>{lang === 'gu' ? 'ભાવ: ₹150 - ₹2000' : '₹150 to ₹2000'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
