import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OurServicesSection } from './components/OurServicesSection';
import { PricingTiers } from './components/PricingTiers';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { OrderFormModal } from './components/OrderFormModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppSupport, WhatsAppSupportSection } from './components/WhatsAppSupport';
import { OrderStatusToastContainer } from './components/OrderStatusToastContainer';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { LiveUpdatesBanner } from './components/LiveUpdatesBanner';
import { WebsiteUpdatesModal } from './components/WebsiteUpdatesModal';
import { BottomNav } from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import { Footer } from './components/Footer';
import { Language, PricingPlan, ServiceItem, VideoCategory, VideoOrder } from './types';
import { isAdminAuthenticated } from './utils/storage';
import { getNotificationHistory } from './utils/notifications';
import {
  Upload,
  Clock,
  Download,
  Film,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('gu');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPlanForOrder, setSelectedPlanForOrder] = useState<PricingPlan | null>(null);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<ServiceItem | null>(null);
  const [customConfigForOrder, setCustomConfigForOrder] = useState<{
    category: VideoCategory;
    durationMinutes: number;
    rushDelivery: boolean;
    includeSubtitles: boolean;
    soundDesign: boolean;
    colorGrading: boolean;
    estimatedPrice: number;
  } | null>(null);

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackSearchQuery, setTrackSearchQuery] = useState('');

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Notification Center
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Live Website Updates Modal
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      setNotificationCount(getNotificationHistory().length);
    };
    updateCount();
    window.addEventListener('gurudev_order_status_updated', updateCount);
    window.addEventListener('gurudev_notification_history_changed', updateCount);
    return () => {
      window.removeEventListener('gurudev_order_status_updated', updateCount);
      window.removeEventListener('gurudev_notification_history_changed', updateCount);
    };
  }, []);

  const handleViewOrder = (orderId: string) => {
    setTrackSearchQuery(orderId);
    setIsTrackModalOpen(true);
  };

  // Sync admin authentication
  useEffect(() => {
    const updateAuth = () => {
      setIsAdmin(isAdminAuthenticated());
    };
    updateAuth();

    window.addEventListener('gurudev_admin_auth_changed', updateAuth);
    return () => {
      window.removeEventListener('gurudev_admin_auth_changed', updateAuth);
    };
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'gu' ? 'en' : 'gu'));
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setIsAdminDashboardOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceForOrder(service);
    setSelectedPlanForOrder(null);
    setCustomConfigForOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlanForOrder(plan);
    setSelectedServiceForOrder(null);
    setCustomConfigForOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleSelectCustomConfig = (config: {
    category: VideoCategory;
    durationMinutes: number;
    rushDelivery: boolean;
    includeSubtitles: boolean;
    soundDesign: boolean;
    colorGrading: boolean;
    estimatedPrice: number;
  }) => {
    setCustomConfigForOrder(config);
    setSelectedPlanForOrder(null);
    setSelectedServiceForOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleSearchOrder = (query: string) => {
    setTrackSearchQuery(query);
    setIsTrackModalOpen(true);
  };

  const handleOrderCreated = (order: VideoOrder) => {
    setTrackSearchQuery(order.id);
  };

  const handleSelectSample = (sampleTitle: string) => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Automatic Live Website Updates Banner */}
      <LiveUpdatesBanner
        lang={lang}
        onOpenOrderModal={() => {
          setSelectedPlanForOrder(null);
          setCustomConfigForOrder(null);
          setIsOrderModalOpen(true);
        }}
        onOpenUpdatesModal={() => setIsUpdatesModalOpen(true)}
      />

      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        isAdmin={isAdmin}
        onOpenAdmin={handleOpenAdmin}
        onOpenOrderModal={() => {
          setSelectedPlanForOrder(null);
          setCustomConfigForOrder(null);
          setIsOrderModalOpen(true);
        }}
        onOpenTrackModal={() => {
          setTrackSearchQuery('');
          setIsTrackModalOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        notificationCount={notificationCount}
        onOpenUpdatesModal={() => setIsUpdatesModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. Hero Section with Studio Visuals & Quick Order Status Search */}
        <HeroSection
          lang={lang}
          onOpenOrderModal={() => {
            setSelectedPlanForOrder(null);
            setCustomConfigForOrder(null);
            setIsOrderModalOpen(true);
          }}
          onSearchOrder={handleSearchOrder}
        />

        {/* 2. How It Works: 4-Step Production Pipeline */}
        <section className="py-16 md:py-20 border-b border-neutral-800 bg-neutral-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                {lang === 'gu' ? 'સરળ પ્રક્રિયા' : 'SEAMLESS 4-STEP WORKFLOW'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'gu' ? 'ઓર્ડરથી ફાઇનલ વિડિયો ડાઉનલોડ સુધી' : 'From Raw Footage to Final Video Download'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                {lang === 'gu'
                  ? 'કોઈ લાંબી રજીસ્ટ્રેશન પ્રક્રિયા વગર સીધો ઓર્ડર આપો અને સ્ટેટસ ટ્રેક કરો.'
                  : 'No customer signup required. Instant booking, transparent tracking, direct download.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Step 1 */}
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 relative group hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'ઓર્ડર નોંધાવો' : '1. Submit Order'}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'gu'
                    ? 'તમારી વિગતો અને વિડિયો કેટેગરી પસંદ કરો. ₹150 થી ₹2000 ના પારદર્શક ભાવે ઓર્ડર બુક કરો.'
                    : 'Choose your video category and requirements with pricing between ₹150 and ₹2000.'}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 relative group hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'વિડિયો અપલોડ કરો' : '2. Upload Footage'}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'gu'
                    ? 'કાચી વિડિયો ક્લિપ્સ ડાયરેક્ટ અપલોડ કરો અથવા Google Drive / Dropbox લિંક શેર કરો.'
                    : 'Upload raw video clips directly or share your Google Drive / Dropbox link.'}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 relative group hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'ઓર્ડર સ્ટેટસ ટ્રેક' : '3. Track Live Status'}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'gu'
                    ? 'Order ID વડે એડિટિંગ, કલર ગ્રેડિંગ અને સાઉન્ડ મિક્સિંગનું લાઇવ સ્ટેટસ જુઓ.'
                    : 'Track your project status in real-time with live progress stages and editor notes.'}
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 relative group hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                  04
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'ફાઇનલ HD ડાઉનલોડ' : '4. Final HD Download'}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'gu'
                    ? 'વેબસાઇટ પર વિડિયો પ્રીવ્યુ જુઓ અને ફાઇનલ હાઇ-ડેફિનેશન વિડિયો ડાઉનલોડ કરો.'
                    : 'Watch final video preview and download master HD render with 1 free revision.'}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 3. Our Services Interactive Catalog (User explicit request: category, serviceList, servicePrice) */}
        <OurServicesSection
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* 4. Transparent Pricing Tiers & Interactive Price Estimator (₹150 to ₹2000) */}
        <PricingTiers
          lang={lang}
          onSelectPlan={handleSelectPlan}
          onSelectCustomConfig={handleSelectCustomConfig}
        />

        {/* 5. Portfolio Showcase featuring Generated Assets */}
        <PortfolioShowcase
          lang={lang}
          onSelectSample={handleSelectSample}
        />

        {/* 5. Client Testimonials & Trust */}
        <section className="py-16 border-b border-neutral-800 bg-neutral-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                {lang === 'gu' ? 'ગ્રાહકોનો સંતોષ' : 'TESTIMONIALS & REVIEWS'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'gu' ? 'ક્રિએટર્સ અને બિઝનેસનો વિશ્વાસ' : 'Trusted by Creators & Event Studios'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  {lang === 'gu'
                    ? '"મારી ઇન્સ્ટાગ્રામ રીલ્સ માત્ર ₹250 માં એડિટ કરાવી. એનિમેટેડ સબટાઈટલ અને સાઉન્ડ એફએક્સ સુપર્બ હતા. વ્યુઅર્સ 3 ગણા વધી ગયા!"'
                    : '"Got my Instagram reel edited for ₹250. The animated Gujarati captions and viral sound effects were incredible. Retention spiked!"'}
                </p>
                <div className="pt-2 border-t border-neutral-800 text-xs">
                  <div className="font-bold text-white">હિતેન પટેલ (Hiten Patel)</div>
                  <div className="text-neutral-500">અમદાવાદ · ફિટનેસ ક્રિએટર</div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  {lang === 'gu'
                    ? '"અમારા ફેમિલી વેડિંગનું 2 મિનિટનું સિનેમેટિક ટીઝર ₹1800 માં બનાવડાવ્યું. ગોલ્ડન અવર ટોનિંગ અને કલર ગ્રેડિંગ અદ્ભુત હતું."'
                    : '"Commissioned a 2-minute royal wedding teaser for ₹1800. The color grading and emotional music sync felt like a Bollywood film!"'}
                </p>
                <div className="pt-2 border-t border-neutral-800 text-xs">
                  <div className="font-bold text-white">નીરવ શાહ (Nirav Shah)</div>
                  <div className="text-neutral-500">સુરત · વેડિંગ પ્લાનર</div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  {lang === 'gu'
                    ? '"ઓનલાઇન ઓર્ડર ટ્રેકિંગ સિસ્ટમ ખૂબ જ મદદરૂપ છે. ક્યારે એડિટિંગ થયું અને ક્યારે ફાઇનલ વિડિયો ડાઉનલોડ કરવા મળ્યો તે લાઇવ દેખાયું."'
                    : '"The live order status tracker and direct final download feature are super transparent. No back-and-forth delays."'}
                </p>
                <div className="pt-2 border-t border-neutral-800 text-xs">
                  <div className="font-bold text-white">ભાવિન મહેતા (Bhavin Mehta)</div>
                  <div className="text-neutral-500">રાજકોટ · યૂટ્યુબ વ્લોગર</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 6. Official WhatsApp Support Desk (3 numbers: 6353894486, 990940414, 9714171301) */}
        <WhatsAppSupportSection lang={lang} />

        {/* 7. Bottom Call to Action */}
        <section className="py-16 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-neutral-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
              {lang === 'gu'
                ? 'તમારા આગામી વિડિયોને પ્રોફેશનલ ટચ આપવા તૈયાર છો?'
                : 'Ready to elevate your next video with professional editing?'}
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
              {lang === 'gu'
                ? 'હમણાં જ કાચી ફૂટેજ અપલોડ કરો. ₹150 થી શરૂ થતા પોસાય તેવા ભાવ અને સુપરફાસ્ટ ડિલિવરી.'
                : 'Upload raw footage today. Starting from just ₹150 with fast 24-48h turnaround.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedPlanForOrder(null);
                  setCustomConfigForOrder(null);
                  setIsOrderModalOpen(true);
                }}
                className="px-6 py-3 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ઓર્ડર બુક કરો (₹150+)' : 'Book Video Edit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setTrackSearchQuery('');
                  setIsTrackModalOpen(true);
                }}
                className="px-5 py-3 text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors"
              >
                {lang === 'gu' ? 'ઓર્ડર સ્ટેટસ ચેક કરો' : 'Track Order Status'}
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenAdmin={handleOpenAdmin}
        onOpenTrackModal={() => {
          setTrackSearchQuery('');
          setIsTrackModalOpen(true);
        }}
        onOpenOrderModal={() => {
          setSelectedPlanForOrder(null);
          setCustomConfigForOrder(null);
          setIsOrderModalOpen(true);
        }}
      />

      {/* MODALS */}

      {/* 1. Order Creation Modal */}
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedServiceForOrder(null);
        }}
        lang={lang}
        initialPlan={selectedPlanForOrder}
        initialService={selectedServiceForOrder}
        initialCustomConfig={customConfigForOrder}
        onOrderCreated={handleOrderCreated}
      />

      {/* 2. Order Tracking & Final Video Download Modal */}
      <OrderStatusModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        lang={lang}
        initialSearchQuery={trackSearchQuery}
      />

      {/* 3. Admin Login Dialog (Login: ફક્ત Admin) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        lang={lang}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 4. Full Admin Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        lang={lang}
        onOpenOrderModal={() => {
          setSelectedPlanForOrder(null);
          setCustomConfigForOrder(null);
          setIsOrderModalOpen(true);
        }}
      />

      {/* 5. Real-Time Order Status Toast Notification Alert System */}
      <OrderStatusToastContainer
        lang={lang}
        onViewOrder={handleViewOrder}
      />

      {/* 6. Notification Center History Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        lang={lang}
        onViewOrder={handleViewOrder}
      />

      {/* 7. Live Website Updates & Announcements Modal */}
      <WebsiteUpdatesModal
        isOpen={isUpdatesModalOpen}
        onClose={() => setIsUpdatesModalOpen(false)}
        lang={lang}
        onOpenOrderModal={() => {
          setSelectedPlanForOrder(null);
          setCustomConfigForOrder(null);
          setIsOrderModalOpen(true);
        }}
      />

      {/* Floating 24x7 WhatsApp Support Launcher */}
      <WhatsAppSupport lang={lang} />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        lang={lang}
        onOpenOrderModal={() => {
          setSelectedPlanForOrder(null);
          setCustomConfigForOrder(null);
          setIsOrderModalOpen(true);
        }}
        onOpenTrackModal={() => {
          setTrackSearchQuery('');
          setIsTrackModalOpen(true);
        }}
      />

    </div>
    </>
  );
}
