import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Trash2,
  Edit,
  Save,
  Download,
  RotateCcw,
  Film,
  DollarSign,
  FileText,
  Video,
  Image as ImageIcon,
  Megaphone,
  Radio,
  Sparkles,
  AlertCircle,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Language, OrderStatus, PaymentStatus, VideoCategory, VideoOrder } from '../types';
import {
  deleteAllOrders,
  deleteOrder,
  getStoredOrders,
  resetDemoOrders,
  setAdminAuthenticated,
  updateOrderDetails,
  updateOrderStatus,
} from '../utils/storage';
import { notifyOrderStatusUpdated } from '../utils/notifications';
import { LogoState, getLogoState, DEFAULT_LOGO_URL } from '../utils/logoManager';
import {
  WebsiteSettings,
  WebsiteUpdateItem,
  getWebsiteSettings,
  publishWebsiteUpdate,
  toggleWebsiteUpdateActive,
} from '../utils/websiteUpdates';
import { LogoModal } from './LogoModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenOrderModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenOrderModal,
}) => {
  const [orders, setOrders] = useState<VideoOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<VideoOrder | null>(null);

  // Edit Form in Inspector
  const [editStatus, setEditStatus] = useState<OrderStatus>('received');
  const [logNote, setLogNote] = useState<string>('');
  const [finalVideoUrl, setFinalVideoUrl] = useState<string>('');
  const [finalVideoDownloadUrl, setFinalVideoDownloadUrl] = useState<string>('');
  const [finalResolution, setFinalResolution] = useState<string>('1080x1920 (9:16 Vertical FHD)');
  const [finalFileSize, setFinalFileSize] = useState<string>('45 MB');
  const [finalPrice, setFinalPrice] = useState<number>(250);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  const [toastMessage, setToastMessage] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirmInput, setDeleteAllConfirmInput] = useState('');
  const [deleteAllError, setDeleteAllError] = useState('');
  const [logoState, setLogoState] = useState<LogoState>(getLogoState);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Tab state: Orders vs Website Updates
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'updates'>('orders');

  // Website Live Updates Editor state
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(getWebsiteSettings);
  const [updateType, setUpdateType] = useState<'announcement' | 'offer' | 'notice' | 'urgent'>('announcement');
  const [badgeGu, setBadgeGu] = useState('🔴 લાઇવ અપડેટ');
  const [badgeEn, setBadgeEn] = useState('🔴 Live Update');
  const [headlineGu, setHeadlineGu] = useState('Gurudev Creative_002: તમામ વિડિયો એડિટિંગ અને ગ્રાફિક ડિઝાઈનિંગ ઓર્ડર ચાલુ છે!');
  const [headlineEn, setHeadlineEn] = useState('Gurudev Creative_002: All video editing and graphic designing orders are open!');
  const [subTextGu, setSubTextGu] = useState('રીલ્સ, યુટ્યુબ વ્લોગ્સ, વેડિંગ ટીઝર અને ડિઝાઇન માત્ર ₹150 થી ₹2000. 24 કલાકમાં ફાસ્ટ ડિલિવરી.');
  const [subTextEn, setSubTextEn] = useState('Reels, YouTube vlogs, wedding teasers & designs from ₹150 to ₹2000. Fast 24-hour delivery.');
  const [actionTextGu, setActionTextGu] = useState('નવો ઓર્ડર નોંધાવો');
  const [actionTextEn, setActionTextEn] = useState('Book New Order');
  const [isUpdateActive, setIsUpdateActive] = useState(true);

  const refreshOrders = () => {
    const all = getStoredOrders();
    setOrders(all);
    if (selectedOrder) {
      const refreshed = all.find((o) => o.id === selectedOrder.id);
      if (refreshed) {
        setSelectedOrder(refreshed);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshOrders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedOrder) {
      setEditStatus(selectedOrder.status);
      setFinalVideoUrl(selectedOrder.finalVideoUrl || '');
      setFinalVideoDownloadUrl(selectedOrder.finalVideoDownloadUrl || '');
      setFinalResolution(selectedOrder.finalVideoResolution || '1080x1920 (9:16 Vertical FHD)');
      setFinalFileSize(selectedOrder.finalVideoFileSize || '45 MB');
      setFinalPrice(selectedOrder.finalPrice || selectedOrder.estimatedPrice || 250);
      setPaymentStatus(selectedOrder.paymentStatus || 'pending');
      setLogNote('');
    }
  }, [selectedOrder]);

  useEffect(() => {
    const handleLogoUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<LogoState>;
      if (customEvent.detail) {
        setLogoState(customEvent.detail);
      } else {
        setLogoState(getLogoState());
      }
    };
    window.addEventListener('gurudev:logo_updated', handleLogoUpdated);
    return () => window.removeEventListener('gurudev:logo_updated', handleLogoUpdated);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  if (!isOpen) return null;

  const handleLogout = () => {
    setAdminAuthenticated(false);
    onClose();
  };

  const handleConfirmResetData = () => {
    resetDemoOrders();
    refreshOrders();
    setSelectedOrder(null);
    setShowResetConfirm(false);
    showToast(lang === 'gu' ? 'ડેમો ઓર્ડર્સ રીસેટ થઈ ગયા!' : 'Sample orders reset successfully!');
  };

  const handleConfirmDeleteOrder = (id: string) => {
    deleteOrder(id);
    refreshOrders();
    if (selectedOrder?.id === id) setSelectedOrder(null);
    setConfirmDeleteId(null);
    showToast(lang === 'gu' ? `ઓર્ડર ${id} ડિલીટ કરવામાં આવ્યો.` : `Order ${id} deleted.`);
  };

  const handleExecuteDeleteAllOrders = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteAllError('');

    const res = deleteAllOrders(deleteAllConfirmInput.trim());
    if (res.error) {
      setDeleteAllError(res.error);
      return;
    }

    refreshOrders();
    setSelectedOrder(null);
    setShowDeleteAllModal(false);
    setDeleteAllConfirmInput('');
    showToast(
      lang === 'gu'
        ? `સફળતાપૂર્વક ${res.deletedCount || 0} ઓર્ડર્સ ડિલીટ કરવામાં આવ્યા.`
        : `Successfully deleted ${res.deletedCount || 0} orders.`
    );
  };

  const handleSaveOrderUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Check if status changed or log added
    const statusChanged = editStatus !== selectedOrder.status || logNote.trim().length > 0;

    let updated: VideoOrder | null = null;
    const commonUpdates: Partial<VideoOrder> = {
      finalPrice: Math.min(2000, Math.max(150, Number(finalPrice))),
      paymentStatus,
      finalVideoUrl: finalVideoUrl.trim() || undefined,
      finalVideoDownloadUrl: finalVideoDownloadUrl.trim() || finalVideoUrl.trim() || undefined,
      finalData: finalVideoDownloadUrl.trim() || finalVideoUrl.trim() || undefined,
      finalName: `${selectedOrder.id}-Edited-Video.mp4`,
      finalVideoResolution: finalResolution.trim(),
      finalVideoFileSize: finalFileSize.trim(),
    };

    if (statusChanged) {
      const defaultNote =
        logNote.trim() ||
        (lang === 'gu'
          ? `સ્ટેટસ બદલાઈને ${editStatus} થયું.`
          : `Status updated to ${editStatus}`);
      updated = updateOrderStatus(selectedOrder.id, editStatus, defaultNote, commonUpdates);
    } else {
      updated = updateOrderDetails(selectedOrder.id, commonUpdates);
      if (commonUpdates.finalData || commonUpdates.finalVideoUrl) {
        notifyOrderStatusUpdated({
          orderId: selectedOrder.id,
          clientName: selectedOrder.clientName,
          clientPhone: selectedOrder.clientPhone,
          title: selectedOrder.title,
          oldStatus: selectedOrder.status,
          newStatus: selectedOrder.status,
          note:
            lang === 'gu'
              ? 'એડિટ કરેલો ફાઇનલ વિડિયો ડાઉનલોડ માટે અપલોડ કરવામાં આવ્યો.'
              : 'Edited final video has been uploaded and is ready for download.',
          finalVideoUrl: commonUpdates.finalVideoUrl,
          finalData: commonUpdates.finalData,
          finalName: commonUpdates.finalName,
          updatedBy: 'Admin',
        });
      }
    }

    if (updated) {
      refreshOrders();
      setSelectedOrder(updated);
      setLogNote('');
      showToast(
        lang === 'gu'
          ? `ઓર્ડર ${selectedOrder.id} નું સ્ટેટસ અપડેટ થઈ ગયું અને યુઝરને ટોસ્ટ એલર્ટ મોકલાયું!`
          : `Order ${selectedOrder.id} status updated & user toast alert broadcasted!`
      );
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.clientName.toLowerCase().includes(q) ||
      order.clientPhone.includes(q) ||
      order.title.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce(
    (acc, o) => acc + (o.finalPrice || o.estimatedPrice || 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === 'received' || o.status === 'verified').length;
  const inProgressCount = orders.filter((o) => o.status === 'editing' || o.status === 'grading' || o.status === 'review').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl h-[95vh] flex flex-col overflow-hidden">
        
        {/* Admin Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsLogoModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 transition-colors"
              title={lang === 'gu' ? 'લોગો સેટિંગ્સ (Add / Remove Logo)' : 'Logo Settings'}
            >
              {logoState.mode === 'custom' && logoState.customUrl ? (
                <img
                  src={logoState.customUrl}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : logoState.mode === 'none' ? (
                <Film className="w-4 h-4 text-neutral-500" />
              ) : (
                <img
                  src={DEFAULT_LOGO_URL}
                  alt="Official Logo"
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Gurudev Creative_002
                </h2>
                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {lang === 'gu'
                  ? 'વિડિયો પ્રોડક્શન અને ઓર્ડર મેનેજમેન્ટ પેનલ (ભાવ: ₹150 - ₹2000)'
                  : 'Video Production & Order Management Panel (₹150 - ₹2000)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
              title={lang === 'gu' ? 'બ્રાન્ડ લોગો ઉમેરો અથવા કાઢી નાખો' : 'Add / Remove Brand Logo'}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{lang === 'gu' ? 'લોગો સેટિંગ્સ' : 'Logo Settings'}</span>
            </button>

            <button
              onClick={() => {
                onOpenOrderModal();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'નવો ઓર્ડર ઉમેરો' : 'Add Order'}</span>
            </button>

            <button
              onClick={() => {
                setDeleteAllConfirmInput('');
                setDeleteAllError('');
                setShowDeleteAllModal(true);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
              title={lang === 'gu' ? 'તમામ ઓર્ડર્સ ડિલીટ કરો' : 'Delete All Orders'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{lang === 'gu' ? 'બધા ડિલીટ કરો' : 'Delete All'}</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title={lang === 'gu' ? 'ડેમો ડેટા રીસેટ' : 'Reset Demo Data'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Orders List & Filters (7 or 12 cols) */}
          <div className={`overflow-y-auto p-4 sm:p-6 border-r border-neutral-800 space-y-5 ${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">
                  {lang === 'gu' ? 'કુલ ઓર્ડર' : 'Total Orders'}
                </div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  {orders.length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">
                  {lang === 'gu' ? 'પેન્ડિંગ / ચકાસણી' : 'Pending Review'}
                </div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  {pendingCount}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">
                  {lang === 'gu' ? 'એડિટિંગ ચાલુ' : 'In Production'}
                </div>
                <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
                  {inProgressCount}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-medium">
                  {lang === 'gu' ? 'પૂર્ણ / ડાઉનલોડ રેડી' : 'Completed'}
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {completedCount}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'gu' ? 'ઓર્ડર, નામ કે ફોનથી શોધો...' : 'Search orders...'}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'received', label: 'Received' },
                  { id: 'editing', label: 'Editing' },
                  { id: 'grading', label: 'Grading' },
                  { id: 'completed', label: 'Completed' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setFilterStatus(st.id)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                      filterStatus === st.id
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards List */}
            <div className="space-y-2.5">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  {lang === 'gu' ? 'કોઈ ઓર્ડર મળ્યો નથી.' : 'No orders found matching filters.'}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const isDone = order.status === 'completed';
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-800/80 border-amber-400 ring-1 ring-amber-400/20'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              {order.id}
                            </span>
                            <span className="text-xs text-neutral-500">·</span>
                            <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                              {order.title}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            {order.clientName} · {order.clientPhone} · {order.city || 'Gujarat'}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-amber-400 font-mono">
                            ₹{order.finalPrice || order.estimatedPrice}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded mt-1 ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : order.status === 'editing' || order.status === 'grading'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Order Info Line */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
                        <div className="flex items-center gap-3">
                          <span className="font-mono">{order.aspectRatio}</span>
                          <span>·</span>
                          <span>
                            {order.durationMinutes < 1
                              ? `${Math.round(order.durationMinutes * 60)}s`
                              : `${order.durationMinutes}m`}
                          </span>
                          <span>·</span>
                          <span className="text-neutral-500">
                            {order.uploadMethod === 'cloud_link' ? 'Drive Link' : `${order.rawFilesCount || 1} files`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {(order.fileData || order.cloudFootageUrl) && (
                            <a
                              href={order.fileData || order.cloudFootageUrl}
                              download={order.fileName || `${order.id}-raw-video.mp4`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 transition-colors"
                              title="ગ્રાહકનો મૂળ વિડિયો ડાઉનલોડ કરો"
                            >
                              <span>📥 મૂળ વિડિયો</span>
                            </a>
                          )}

                          <a
                            href={`https://wa.me/91${order.clientPhone}?text=${encodeURIComponent(
                              `નમસ્તે ${order.clientName}! Gurudev Creative તરફથી તમારા વિડિયો ઓર્ડર (${order.id}) નું સ્ટેટસ: ${order.status.toUpperCase()}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                            title="WhatsApp Client"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(order.id);
                            }}
                            className="p-1 text-neutral-500 hover:text-rose-400"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Order Inspector & Manager (5 cols) */}
          {selectedOrder ? (
            <div className="lg:col-span-5 overflow-y-auto p-4 sm:p-6 bg-neutral-950 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <div className="text-xs text-neutral-400">
                    {lang === 'gu' ? 'ઓર્ડર મેનેજમેન્ટ' : 'Order Inspector'}
                  </div>
                  <div className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-amber-400">{selectedOrder.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-400 hover:text-white lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Management Form */}
              <form onSubmit={handleSaveOrderUpdates} className="space-y-4">
                
                {/* 1. Status Update Control */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {lang === 'gu' ? 'પ્રોડક્શન સ્ટેટસ બદલો (Change Status) *' : 'Production Status *'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    <option value="received">1. Order Received (ઓર્ડર સ્વીકારાયો)</option>
                    <option value="verified">2. Footage Verified (ફૂટેજ ચકાસણી)</option>
                    <option value="editing">3. Editing in Progress (એડિટિંગ ચાલુ છે)</option>
                    <option value="grading">4. Color & Audio Grading (કલર અને ઓડિયો)</option>
                    <option value="review">5. Final QA Review (અંતિમ રિવ્યુ)</option>
                    <option value="completed">6. Completed & Ready for Download (ડાઉનલોડ રેડી)</option>
                  </select>
                </div>

                {/* 2. Timeline Note Entry */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {lang === 'gu' ? 'નવી સ્ટેટસ નોંધ (Timeline Note)' : 'Add Activity Log Note'}
                  </label>
                  <input
                    type="text"
                    value={logNote}
                    onChange={(e) => setLogNote(e.target.value)}
                    placeholder={
                      lang === 'gu'
                        ? 'દા.ત. ડ્રાફ્ટ 1 વ્હોટ્સએપ પર મોકલ્યો, કલર ગ્રેડિંગ પૂરું થયું...'
                        : 'e.g. Color grading LUT applied, draft ready for review...'
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* 3. Final Video URL for Client Download (User explicitly requested!) */}
                <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Video className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? 'ફાઇનલ વિડિયો ડિલિવરી (Download Links)' : 'Final Video Deliverable'}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-300 mb-1">
                      {lang === 'gu' ? 'ફાઇનલ વિડિયો લિંક (Direct Video / Drive URL)' : 'Final Video URL'}
                    </label>
                    <input
                      type="url"
                      value={finalVideoUrl}
                      onChange={(e) => setFinalVideoUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or https://domain.com/video.mp4"
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-md text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFinalVideoUrl(
                            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                          );
                          setFinalVideoDownloadUrl(
                            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                          );
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        {lang === 'gu' ? 'સેમ્પલ MP4 લિંક ભરો' : 'Fill Sample Video Link'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-300 mb-1">
                        {lang === 'gu' ? 'રેઝોલ્યુશન' : 'Resolution'}
                      </label>
                      <input
                        type="text"
                        value={finalResolution}
                        onChange={(e) => setFinalResolution(e.target.value)}
                        placeholder="1080x1920 (9:16) or 4K"
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-md text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-300 mb-1">
                        {lang === 'gu' ? 'ફાઇલ સાઇઝ' : 'File Size'}
                      </label>
                      <input
                        type="text"
                        value={finalFileSize}
                        onChange={(e) => setFinalFileSize(e.target.value)}
                        placeholder="48.5 MB"
                        className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-md text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {(finalVideoDownloadUrl || finalVideoUrl) && (
                    <div className="pt-1">
                      <a
                        href={finalVideoDownloadUrl || finalVideoUrl}
                        download={selectedOrder.finalName || `${selectedOrder.id}-Edited-Video.mp4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          padding: "10px 14px",
                          background: "#6554d9",
                          color: "white",
                          borderRadius: "10px",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        📥 Download Edited Video
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. Pricing & Payment Controls (Strictly ₹150 to ₹2000) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {lang === 'gu' ? 'ફાઇનલ ભાવ (₹150 - ₹2000)' : 'Agreed Price (₹)'}
                    </label>
                    <input
                      type="number"
                      min={150}
                      max={2000}
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {lang === 'gu' ? 'પેમેન્ટ સ્ટેટસ' : 'Payment Status'}
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="pending">Pending (બાકી)</option>
                      <option value="advance_paid">Advance Paid (એડવાન્સ)</option>
                      <option value="paid">Fully Paid (સંપૂર્ણ ચુકવેલ)</option>
                    </select>
                  </div>
                </div>

                {/* ગ્રાહકે મોકલેલો મૂળ ફોટો / વિડિયો (Client Raw Footage Download) */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      <span>ગ્રાહકે મોકલેલો મૂળ ફોટો / વિડિયો</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {selectedOrder.fileName || (selectedOrder.uploadMethod === 'file' ? 'Local Upload' : 'Cloud Link')}
                    </span>
                  </div>

                  {/* Button strictly implementing the requested snippet */}
                  {selectedOrder.fileData ? (
                    <a
                      href={selectedOrder.fileData}
                      download={selectedOrder.fileName || `${selectedOrder.id}-Client-Raw-Footage.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10"
                    >
                      <span>📥 ગ્રાહકનો મૂળ વિડિયો ડાઉનલોડ કરો</span>
                    </a>
                  ) : selectedOrder.uploadMethod === 'cloud_link' && selectedOrder.cloudFootageUrl ? (
                    <a
                      href={selectedOrder.cloudFootageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>📥 ગ્રાહકનો મૂળ વિડિયો ડાઉનલોડ કરો (Google Drive)</span>
                    </a>
                  ) : (
                    <div className="text-xs text-neutral-400">
                      ફૂટેજ લિંક ઉપલબ્ધ નથી
                    </div>
                  )}

                  {/* Extra files list if multiple uploaded */}
                  {selectedOrder.rawFiles && selectedOrder.rawFiles.length > 0 && (
                    <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                      <div className="text-[11px] text-neutral-400 font-semibold">
                        અપલોડ કરેલ તમામ ફાઇલ્સ ({selectedOrder.rawFiles.length}):
                      </div>
                      {selectedOrder.rawFiles.map((rf, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-neutral-950 px-2.5 py-1.5 rounded border border-neutral-800/60"
                        >
                          <span className="truncate max-w-[200px] text-neutral-300 font-mono text-[11px]">
                            {rf.name}
                          </span>
                          {rf.dataUrl && (
                            <a
                              href={rf.dataUrl}
                              download={rf.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                            >
                              <span>📥 ડાઉનલોડ</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedOrder.description && (
                    <div className="text-neutral-400 pt-1 text-[11px] italic bg-neutral-950/60 p-2 rounded border border-neutral-800">
                      "{selectedOrder.description}"
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/91${selectedOrder.clientPhone}?text=${encodeURIComponent(
                      `નમસ્તે ${selectedOrder.clientName}! Gurudev Creative_002 તરફથી અપડેટ:\nતમારો વિડિયો ઓર્ડર (${selectedOrder.id}) નું સ્ટેટસ હવે "${editStatus.toUpperCase()}" છે.\nભાવ: ₹${finalPrice}\nવેબસાઇટ પર લાઇવ ચેક કરો.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? 'WhatsApp મેસેજ' : 'WhatsApp'}</span>
                  </a>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? 'ફેરફાર સેવ કરો' : 'Save Changes'}</span>
                  </button>
                </div>

              </form>

            </div>
          ) : null}

        </div>

        {/* In-UI Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Confirmation Modal for Reset Data */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-sm p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'gu' ? 'ડેમો ડેટા રીસેટ કરવો છે?' : 'Reset Sample Orders?'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu'
                    ? 'આનાથી તમામ મૂળ 4 સેમ્પલ ઓર્ડર્સ પુનઃસ્થાપિત થશે.'
                    : 'This will restore the default 4 demonstration projects.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
                >
                  {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetData}
                  className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  {lang === 'gu' ? 'હા, રીસેટ કરો' : 'Confirm Reset'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Delete Order */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-sm p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'gu' ? `ઓર્ડર ${confirmDeleteId} ડિલીટ કરવો છે?` : `Delete Order ${confirmDeleteId}?`}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu'
                    ? 'આ ઓર્ડર કાયમ માટે કાઢી નાખવામાં આવશે.'
                    : 'This action will permanently delete this client project.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
                >
                  {lang === 'gu' ? 'ના, રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDeleteOrder(confirmDeleteId)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                >
                  {lang === 'gu' ? 'હા, ડિલીટ કરો' : 'Delete Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Delete All Orders (DELETE_ALL_ORDERS) */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-rose-500/40 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'gu' ? 'તમામ ઓર્ડર્સ કાયમ માટે ડિલીટ કરવા છે?' : 'Delete All Orders Permanently?'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu'
                    ? 'આ ક્રિયા પાછી લાવી શકાતી નથી. ફક્ત Admin જ તમામ ઓર્ડર ડિલીટ કરી શકે છે. કન્ફર્મ કરવા નીચેના બોક્સમાં બરાબર "DELETE_ALL_ORDERS" લખો:'
                    : 'This action is irreversible. Only Admin can delete all orders. Type "DELETE_ALL_ORDERS" to confirm:'}
                </p>
              </div>

              {deleteAllError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {deleteAllError}
                </div>
              )}

              <form onSubmit={handleExecuteDeleteAllOrders} className="space-y-3">
                <input
                  type="text"
                  autoFocus
                  required
                  value={deleteAllConfirmInput}
                  onChange={(e) => {
                    setDeleteAllConfirmInput(e.target.value);
                    if (deleteAllError) setDeleteAllError('');
                  }}
                  placeholder="DELETE_ALL_ORDERS"
                  className="w-full px-3 py-2 text-xs font-mono font-bold tracking-wider text-center bg-neutral-950 border border-neutral-700 rounded-lg text-rose-300 placeholder-neutral-600 focus:border-rose-500 focus:outline-none"
                />

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteAllModal(false);
                      setDeleteAllConfirmInput('');
                      setDeleteAllError('');
                    }}
                    className="px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-600/20 transition-all"
                  >
                    {lang === 'gu' ? 'કન્ફર્મ ડિલીટ (DELETE)' : 'Confirm Delete All'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Brand Logo Add / Remove / Change Modal */}
        <LogoModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
          lang={lang}
          logoState={logoState}
        />

      </div>
    </div>
  );
};
