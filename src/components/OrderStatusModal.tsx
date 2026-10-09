import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Download,
  Play,
  Film,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { Language, OrderStatus, VideoOrder } from '../types';
import { getStoredOrders, updateOrderStatus } from '../utils/storage';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialSearchQuery?: string;
  onOrderUpdated?: (order: VideoOrder) => void;
}

const STATUS_STEPS: { key: OrderStatus; labelGu: string; labelEn: string; descGu: string; descEn: string }[] = [
  {
    key: 'received',
    labelGu: 'ઓર્ડર સ્વીકારાયો',
    labelEn: 'Order Received',
    descGu: 'તમારો ઓર્ડર સિસ્ટમમાં સફળતાપૂર્વક નોંધાયો છે.',
    descEn: 'Order registered in our studio queue.',
  },
  {
    key: 'verified',
    labelGu: 'ફૂટેજ ચકાસણી',
    labelEn: 'Footage Verified',
    descGu: 'કાચી વિડિયો ક્લિપ્સ અને ઓડિયો ગુણવત્તા ચકાસાઈ ગઈ છે.',
    descEn: 'Raw video clips & audio inspected by editor.',
  },
  {
    key: 'editing',
    labelGu: 'એડિટિંગ ચાલુ છે',
    labelEn: 'Editing in Progress',
    descGu: 'કટ્સ, ટ્રાન્ઝિશન, સબટાઈટલ અને બીટ મેચિંગનું કામ ચાલી રહ્યું છે.',
    descEn: 'Pacing, cuts, transitions & subtitle sync underway.',
  },
  {
    key: 'grading',
    labelGu: 'કલર & ઓડિયો મિક્સિંગ',
    labelEn: 'Color & Audio Grading',
    descGu: 'સિનેમેટિક કલર ગ્રેડિંગ અને સાઉન્ડ ડિઝાઇન ઉમેરાઈ રહી છે.',
    descEn: 'Cinematic color correction, LUTs & sound design added.',
  },
  {
    key: 'review',
    labelGu: 'અંતિમ ગુણવત્તા તપાસ',
    labelEn: 'Final QA Review',
    descGu: 'હાઇ-ડેફિનેશન માસ્ટર રેન્ડરિંગ અને ક્યુરેટેડ રિવ્યુ.',
    descEn: 'Master render check and final quality assurance.',
  },
  {
    key: 'completed',
    labelGu: 'તૈયાર & ડાઉનલોડ ઉપલબ્ધ',
    labelEn: 'Ready for Download',
    descGu: 'ફાઇનલ વિડિયો તૈયાર છે. તમે સીધો ડાઉનલોડ કરી શકો છો!',
    descEn: 'Final edited video is delivered and ready for download!',
  },
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialSearchQuery = '',
  onOrderUpdated,
}) => {
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  const [currentOrder, setCurrentOrder] = useState<VideoOrder | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchInput(initialSearchQuery);
      performSearch(initialSearchQuery);
    } else {
      // Default load first sample order if available
      const all = getStoredOrders();
      if (all.length > 0) {
        setCurrentOrder(all[0]);
      }
    }
  }, [initialSearchQuery, isOpen]);

  if (!isOpen) return null;

  const performSearch = (query: string) => {
    setSearchError('');
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    const all = getStoredOrders();
    const found = all.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.clientPhone.includes(clean) ||
        o.clientName.toUpperCase().includes(clean)
    );

    if (found) {
      setCurrentOrder(found);
    } else {
      setSearchError(
        lang === 'gu'
          ? `કોઈ ઓર્ડર મળ્યો નથી: "${query}". કૃપા કરીને સાચો Order ID (દા.ત. GC-2026-8801) અથવા મોબાઇલ નંબર લખો.`
          : `No order found for "${query}". Please check the Order ID or phone number.`
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  // Get index of current status in steps
  const getStatusIndex = (st: OrderStatus) => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === st);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = currentOrder ? getStatusIndex(currentOrder.status) : 0;

  const handleDownloadVideo = () => {
    if (!currentOrder || !currentOrder.finalVideoDownloadUrl) return;
    // Trigger download
    const link = document.createElement('a');
    link.href = currentOrder.finalVideoDownloadUrl;
    link.target = '_blank';
    link.download = `${currentOrder.id}_final_video.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendRevision = () => {
    if (!currentOrder || !revisionNote.trim()) return;
    setIsRequestingRevision(true);
    
    // Update order status back to editing with revision note
    const updated = updateOrderStatus(
      currentOrder.id,
      'editing',
      `ગ્રાહક દ્વારા રિવિઝન વિનંતી: ${revisionNote.trim()}`,
      {
        revisionCount: (currentOrder.revisionCount || 0) + 1,
        revisionNotes: revisionNote.trim(),
      }
    );

    if (updated) {
      setCurrentOrder(updated);
      if (onOrderUpdated) onOrderUpdated(updated);
      setShowRevisionBox(false);
      setRevisionNote('');
    }
    setIsRequestingRevision(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'gu' ? 'ઓર્ડર સ્ટેટસ & ફાઇનલ વિડિયો ડાઉનલોડ' : 'Order Status & Final Download'}
              </h2>
              <p className="text-xs text-neutral-400">
                {lang === 'gu'
                  ? 'લાઇવ પ્રોડક્શન ટ્રેકર · Gurudev Creative_002'
                  : 'Live Production Tracker · Gurudev Creative_002'}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Lookup Bar */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    lang === 'gu'
                      ? 'ઓર્ડર ID (દા.ત. GC-2026-8801) અથવા મોબાઇલ નંબર લખો...'
                      : 'Search by Order ID (e.g. GC-2026-8801) or phone number...'
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {lang === 'gu' ? 'શોધો (Search)' : 'Track'}
              </button>
            </form>

            {/* Quick Demo Pickers */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-neutral-400">
              <span>{lang === 'gu' ? 'સેમ્પલ ઓર્ડર ચેક કરો:' : 'Try sample orders:'}</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('GC-2026-8801');
                  performSearch('GC-2026-8801');
                }}
                className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-mono border border-neutral-800"
              >
                GC-2026-8801 ({lang === 'gu' ? 'પૂર્ણ & ડાઉનલોડ' : 'Completed'})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('GC-2026-8802');
                  performSearch('GC-2026-8802');
                }}
                className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-mono border border-neutral-800"
              >
                GC-2026-8802 ({lang === 'gu' ? 'એડિટિંગ ચાલુ' : 'In Progress'})
              </button>
            </div>

            {searchError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}
          </div>

          {/* Active Order Details */}
          {currentOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta Ribbon */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {currentOrder.id}
                    </span>
                    <span className="text-xs text-neutral-500">·</span>
                    <span className="text-xs font-semibold text-white">
                      {currentOrder.title}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-2">
                    <span>{currentOrder.clientName}</span>
                    <span>·</span>
                    <span className="font-mono">{currentOrder.clientPhone}</span>
                    <span>·</span>
                    <span>{currentOrder.city || 'Gujarat'}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="text-xs text-neutral-400">
                    {lang === 'gu' ? 'અંદાજિત ભાવ' : 'Price Agreed'}
                  </div>
                  <div className="text-xl font-black text-amber-400 font-mono">
                    ₹{currentOrder.finalPrice || currentOrder.estimatedPrice}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {currentOrder.paymentStatus === 'paid'
                      ? (lang === 'gu' ? 'ચુકવણી પૂર્ણ (Paid)' : 'Fully Paid')
                      : currentOrder.paymentStatus === 'advance_paid'
                      ? (lang === 'gu' ? 'એડવાન્સ ચુકવેલ' : 'Advance Paid')
                      : (lang === 'gu' ? 'ડિલિવરી સમયે પેમેન્ટ' : 'Pay on Delivery')}
                  </div>
                </div>
              </div>

              {/* Visual 6-Stage Progress Timeline */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
                  {lang === 'gu' ? 'ઓર્ડર પ્રગતિ સ્ટેટસ (Order Progress)' : 'Live Production Status'}
                </div>

                {/* Progress Bar Container */}
                <div className="relative mb-6 hidden md:block">
                  <div className="h-1 bg-neutral-800 rounded-full w-full absolute top-4 left-0 -z-0" />
                  <div
                    className="h-1 bg-amber-400 rounded-full absolute top-4 left-0 -z-0 transition-all duration-500"
                    style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                  
                  <div className="flex justify-between relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPast = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center max-w-[100px]">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isPast
                                ? 'bg-amber-400 text-neutral-950 ring-4 ring-neutral-900'
                                : isCurrent
                                ? 'bg-amber-400 text-neutral-950 ring-4 ring-amber-400/30 scale-110'
                                : 'bg-neutral-800 text-neutral-500 ring-4 ring-neutral-900'
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] mt-2 font-medium leading-tight ${
                              isCurrent ? 'text-amber-400 font-bold' : isPast ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {lang === 'gu' ? step.labelGu : step.labelEn}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Vertical Stepper View */}
                <div className="md:hidden space-y-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const isPast = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div
                        key={step.key}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : isPast
                            ? 'bg-neutral-900 border-neutral-800'
                            : 'bg-neutral-950/40 border-neutral-900 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isPast
                              ? 'bg-amber-400 text-neutral-950'
                              : isCurrent
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-amber-400' : isPast ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {lang === 'gu' ? step.labelGu : step.labelEn}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            {lang === 'gu' ? step.descGu : step.descEn}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current Active Status Callout */}
                <div className="mt-4 p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      {lang === 'gu' ? 'હાલનું સ્ટેટસ: ' : 'Current Status: '}
                    </span>
                    <span className="text-amber-400 font-bold">
                      {lang === 'gu'
                        ? STATUS_STEPS[currentStepIdx].labelGu
                        : STATUS_STEPS[currentStepIdx].labelEn}
                    </span>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {lang === 'gu'
                        ? STATUS_STEPS[currentStepIdx].descGu
                        : STATUS_STEPS[currentStepIdx].descEn}
                    </div>
                  </div>
                </div>
              </div>

              {/* FINAL VIDEO DOWNLOAD SECTION (If Completed) */}
              {currentOrder.status === 'completed' ? (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-amber-500/50 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {lang === 'gu' ? 'ફાઇનલ વિડિયો તૈયાર છે!' : 'Final Video Master Ready!'}
                        </h4>
                        <p className="text-xs text-neutral-400">
                          {lang === 'gu'
                            ? 'તમારો એડિટ કરેલ હાઇ-ડેફિનેશન વિડિયો ડાઉનલોડ માટે ઉપલબ્ધ છે.'
                            : 'Your edited high-definition master video is ready for download.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-1 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                        {currentOrder.finalVideoResolution || '1080p FHD'}
                      </span>
                      <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {currentOrder.finalVideoFileSize || '48 MB'}
                      </span>
                    </div>
                  </div>

                  {/* Video Player Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-black border border-neutral-800 aspect-video flex items-center justify-center group">
                    {currentOrder.finalVideoUrl ? (
                      <video
                        src={currentOrder.finalVideoUrl}
                        controls
                        className="w-full h-full object-contain"
                        poster="/src/assets/images/hero_video_editing_studio_1791513305504.jpg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <Play className="w-10 h-10 text-amber-400 mx-auto" />
                        <div className="text-xs text-neutral-300">
                          {lang === 'gu' ? 'વિડિયો પ્રીવ્યુ તૈયાર છે' : 'Master Video Ready'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Direct Download + Revision */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {/* Exact requested button: 📥 Download Edited Video */}
                    <a
                      href={currentOrder.finalData || currentOrder.finalVideoDownloadUrl || currentOrder.finalVideoUrl}
                      download={currentOrder.finalName || "Edited-Video.mp4"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "12px",
                        background: "#6554d9",
                        color: "white",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                      className="w-full sm:flex-1 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>📥 Download Edited Video</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowRevisionBox(!showRevisionBox)}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'gu' ? 'રિવિઝન રિક્વેસ્ટ (Revision)' : 'Request Revision'}</span>
                    </button>
                  </div>

                  {/* Revision Input Box */}
                  {showRevisionBox && (
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 mt-3">
                      <div className="text-xs font-semibold text-white">
                        {lang === 'gu'
                          ? 'શું ફેરફાર કરવો છે તે વિગતવાર લખો (1 ફ્રી રિવિઝન શામેલ છે):'
                          : 'Describe revision changes required (1 free revision included):'}
                      </div>
                      <textarea
                        rows={2}
                        value={revisionNote}
                        onChange={(e) => setRevisionNote(e.target.value)}
                        placeholder={
                          lang === 'gu'
                            ? 'દા.ત. 15મી સેકન્ડ પર સબટાઈટલ સાઈઝ નાની કરો, બેકગ્રાઉન્ડ મ્યુઝિક થોડું ધીમું કરો...'
                            : 'e.g. Adjust volume on intro, fix typo in 0:14 subtitle...'
                        }
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRevisionBox(false)}
                          className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                        >
                          {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          disabled={isRequestingRevision || !revisionNote.trim()}
                          onClick={handleSendRevision}
                          className="px-4 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg disabled:opacity-50"
                        >
                          {lang === 'gu' ? 'રિવિઝન મોકલો' : 'Submit Revision'}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>
                      {lang === 'gu'
                        ? 'વિડિયો પર કામ ચાલી રહ્યું છે. પૂર્ણ થતાં જ અહીં ડાઉનલોડ બટન સક્રિય થઈ જશે.'
                        : 'Editing is actively in progress. The download button will unlock as soon as final rendering completes.'}
                    </span>
                  </div>
                  <span className="font-mono text-amber-400 shrink-0">
                    {currentOrder.rushDelivery ? '24h Delivery' : 'Standard Delivery'}
                  </span>
                </div>
              )}

              {/* Status Update Logs Timeline */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {lang === 'gu' ? 'એડિટર અપડેટ હિસ્ટ્રી (Update Logs)' : 'Editor Activity Logs'}
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {currentOrder.statusLogs && currentOrder.statusLogs.length > 0 ? (
                    currentOrder.statusLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-neutral-400">
                          <span className="font-semibold text-amber-300">
                            {log.updatedBy}: {log.status.toUpperCase()}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-500">
                            {log.timestamp}
                          </span>
                        </div>
                        <div className="text-neutral-300">{log.note}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-neutral-500">No logs yet.</div>
                  )}
                </div>
              </div>

              {/* Raw Footage Links Info */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-semibold">
                    {lang === 'gu' ? 'તમે મોકલેલ કાચી ફૂટેજ (Submitted Footage):' : 'Submitted Raw Footage:'}
                  </span>
                  <span className="font-mono text-neutral-500 text-[11px]">
                    {currentOrder.fileName || (currentOrder.uploadMethod === 'cloud_link' ? 'Cloud Link' : 'Local File')}
                  </span>
                </div>

                {/* গ્રાહકે મોકલેલો મૂળ ફોટો / વિડિયો Download */}
                {currentOrder.fileData ? (
                  <div>
                    <a
                      href={currentOrder.fileData}
                      download={currentOrder.fileName || `${currentOrder.id}-client-raw.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>📥 ગ્રાહકનો મૂળ વિડિયો ડાઉનલોડ કરો</span>
                    </a>
                  </div>
                ) : currentOrder.uploadMethod === 'cloud_link' && currentOrder.cloudFootageUrl ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <a
                      href={currentOrder.cloudFootageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>📥 ગ્રાહકનો મૂળ વિડિયો ડાઉનલોડ કરો (Google Drive)</span>
                    </a>
                    <span className="text-neutral-500 font-mono text-[11px] truncate">
                      {currentOrder.cloudFootageUrl}
                    </span>
                  </div>
                ) : (
                  <div className="text-neutral-300">
                    {currentOrder.rawFilesCount || 0} files uploaded (
                    {currentOrder.rawFilesNames?.join(', ') || 'Clips'})
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Contact */}
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <div className="text-center text-[11px] text-neutral-400 font-medium">
                  {lang === 'gu'
                    ? 'આ ઓર્ડર વિશે એડિટર સાથે WhatsApp પર વાત કરો:'
                    : 'Chat with editor regarding this order on WhatsApp:'}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/916353894486?text=${encodeURIComponent(
                      `નમસ્તે Gurudev Creative! મારો ઓર્ડર ID ${currentOrder.id} સંબંધિત પૂછપરછ છે.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>6353894486 (Main)</span>
                  </a>
                  <a
                    href={`https://wa.me/91990940414?text=${encodeURIComponent(
                      `નમસ્તે Gurudev Creative! મારો ઓર્ડર ID ${currentOrder.id} સંબંધિત પૂછપરછ છે.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-neutral-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>990940414</span>
                  </a>
                  <a
                    href={`https://wa.me/919714171301?text=${encodeURIComponent(
                      `નમસ્તે Gurudev Creative! મારો ઓર્ડર ID ${currentOrder.id} સંબંધિત પૂછપરછ છે.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-neutral-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>9714171301</span>
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500 text-xs">
              {lang === 'gu'
                ? 'કોઈ ઓર્ડર પસંદ કરેલ નથી. ઉપર બોક્સમાં તમારો Order ID લખો.'
                : 'No order selected. Enter an Order ID above to check progress.'}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
