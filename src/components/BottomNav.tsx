import React, { useState } from 'react';
import { Language } from '../types';

interface BottomNavProps {
  lang: Language;
  onOpenOrderModal: () => void;
  onOpenTrackModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  lang,
  onOpenOrderModal,
  onOpenTrackModal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const showOrders = () => {
    setMenuOpen(false);
    onOpenTrackModal();
  };

  const handleNewOrder = () => {
    setMenuOpen(false);
    onOpenOrderModal();
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto p-3 sm:hidden">
      {/* Menu Panel popup */}
      <div
        id="menu-panel"
        className={`p-3 bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 mb-2 transition-all ${
          menuOpen ? 'block animate-fadeIn' : 'hidden'
        }`}
      >
        <button
          onClick={showOrders}
          className="w-full p-3 mb-2 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-left text-sm font-bold flex items-center gap-2.5 text-neutral-800 transition-colors"
        >
          <span>📋</span>
          <span>{lang === 'gu' ? 'મારા ઓર્ડર (My Orders / Track)' : '📋 My Orders'}</span>
        </button>

        <button
          onClick={handleNewOrder}
          className="w-full p-3 mb-2 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-left text-sm font-bold flex items-center gap-2.5 text-neutral-800 transition-colors"
        >
          <span>➕</span>
          <span>{lang === 'gu' ? 'નવો ઓર્ડર બુક કરો (New Order)' : '➕ New Order'}</span>
        </button>

        <button
          onClick={() => {
            setMenuOpen(false);
            alert(lang === 'gu' ? 'Gurudev Creative_002 ગ્રાહક પ્રોફાઇલ' : 'Gurudev Creative_002 Client Profile');
          }}
          className="w-full p-3 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-left text-sm font-bold flex items-center gap-2.5 text-neutral-800 transition-colors"
        >
          <span>👤</span>
          <span>{lang === 'gu' ? 'મારું પ્રોફાઇલ (My Profile)' : '👤 My Profile'}</span>
        </button>
      </div>

      {/* Bottom Nav Bar */}
      <nav className="bottom-nav flex items-center justify-between gap-3 w-full px-4 py-3 bg-white rounded-2xl shadow-xl border border-neutral-200">
        <button
          className="nav-item flex flex-col items-center justify-center gap-1 border-0 bg-transparent text-neutral-700 text-xs font-bold min-w-[70px] cursor-pointer"
          onClick={showOrders}
        >
          <span className="orders-icon text-2xl text-neutral-900 leading-none">☷</span>
          <span>{lang === 'gu' ? 'ઓર્ડર' : 'ORDERS'}</span>
        </button>

        <button
          className="new-order flex-1 min-h-[52px] border-0 rounded-full bg-[#303b56] hover:bg-[#20283d] text-white text-base sm:text-lg font-bold whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 shadow-md transition-all"
          onClick={handleNewOrder}
        >
          <span className="text-xl leading-none">＋</span>
          <span>{lang === 'gu' ? 'નવો ઓર્ડર' : 'New Order'}</span>
        </button>

        <button
          className="nav-item flex flex-col items-center justify-center gap-1 border-0 bg-transparent text-neutral-700 text-xs font-bold min-w-[70px] cursor-pointer"
          onClick={toggleMenu}
        >
          <span className="menu-icon text-2xl text-neutral-900 leading-none">☰</span>
          <span>{lang === 'gu' ? 'મેનુ' : 'MENU'}</span>
        </button>
      </nav>
    </div>
  );
};
