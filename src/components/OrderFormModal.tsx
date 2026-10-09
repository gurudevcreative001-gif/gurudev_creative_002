import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, CheckCircle2, Film, AlertCircle, Copy, Check, MessageSquare, Palette } from 'lucide-react';
import { AspectRatioType, Language, MainCategory, PricingPlan, RawFileItem, ServiceItem, VideoCategory, VideoOrder } from '../types';
import { addOrder, calculateEstimatedPrice } from '../utils/storage';
import { saveRawFile } from '../utils/fileStorage';
import { GURUDEV_SERVICES } from '../data/initialData';
import { PayNowButton } from './PayNowButton';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialPlan?: PricingPlan | null;
  initialService?: ServiceItem | null;
  initialCustomConfig?: {
    category: VideoCategory;
    durationMinutes: number;
    rushDelivery: boolean;
    includeSubtitles: boolean;
    soundDesign: boolean;
    colorGrading: boolean;
    estimatedPrice: number;
  } | null;
  onOrderCreated: (newOrder: VideoOrder) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialPlan,
  initialService,
  initialCustomConfig,
  onOrderCreated,
}) => {
  // Service selection matching user's exact snippet
  const [mainCategory, setMainCategory] = useState<MainCategory | ''>('video');
  const [serviceName, setServiceName] = useState<string>('Instagram Reel Editing');
  const [servicePrice, setServicePrice] = useState<number>(150);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('reels_shorts');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [durationMinutes, setDurationMinutes] = useState<number>(0.5);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [soundDesign, setSoundDesign] = useState(true);
  const [colorGrading, setColorGrading] = useState(true);
  
  // Footage Upload (Default: Direct Photo & Video File Upload)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'cloud_link'>('file');
  const [cloudFootageUrl, setCloudFootageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Submission & Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<VideoOrder | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill from plan, service or custom config
  useEffect(() => {
    if (initialService) {
      setMainCategory(initialService.category);
      setServiceName(initialService.name);
      setServicePrice(initialService.price);
      setTitle(initialService.name);
      if (initialService.category === 'design') {
        setCategory('other');
        setAspectRatio('1:1');
      } else if (
        initialService.name.toLowerCase().includes('reel') ||
        initialService.name.toLowerCase().includes('status')
      ) {
        setCategory('reels_shorts');
        setAspectRatio('9:16');
      } else if (initialService.name.toLowerCase().includes('wedding')) {
        setCategory('cinematic_wedding');
        setAspectRatio('16:9');
      } else {
        setCategory('youtube_vlog');
        setAspectRatio('16:9');
      }
    } else if (initialCustomConfig) {
      setCategory(initialCustomConfig.category);
      setDurationMinutes(initialCustomConfig.durationMinutes);
      setRushDelivery(initialCustomConfig.rushDelivery);
      setIncludeSubtitles(initialCustomConfig.includeSubtitles);
      setSoundDesign(initialCustomConfig.soundDesign);
      setColorGrading(initialCustomConfig.colorGrading);
      if (initialCustomConfig.category === 'reels_shorts') {
        setAspectRatio('9:16');
      } else {
        setAspectRatio('16:9');
      }
    } else if (initialPlan) {
      setCategory(initialPlan.category);
      if (initialPlan.category === 'reels_shorts') {
        setDurationMinutes(0.5);
        setAspectRatio('9:16');
      } else if (initialPlan.category === 'youtube_vlog') {
        setDurationMinutes(5);
        setAspectRatio('16:9');
      } else if (initialPlan.category === 'brand_commercial') {
        setDurationMinutes(1);
        setAspectRatio('16:9');
      } else if (initialPlan.category === 'cinematic_wedding') {
        setDurationMinutes(2.5);
        setAspectRatio('16:9');
      }
    }
  }, [initialPlan, initialService, initialCustomConfig, isOpen]);

  const handleMainCategoryChange = (val: MainCategory | '') => {
    setMainCategory(val);
    if (val) {
      const list = GURUDEV_SERVICES[val] || [];
      if (list.length > 0) {
        setServiceName(list[0].name);
        setServicePrice(list[0].price);
        setTitle(list[0].name);
        if (val === 'design') {
          setCategory('other');
          setAspectRatio('1:1');
        } else {
          if (
            list[0].name.toLowerCase().includes('reel') ||
            list[0].name.toLowerCase().includes('status')
          ) {
            setCategory('reels_shorts');
            setAspectRatio('9:16');
          } else if (list[0].name.toLowerCase().includes('wedding')) {
            setCategory('cinematic_wedding');
            setAspectRatio('16:9');
          } else {
            setCategory('youtube_vlog');
            setAspectRatio('16:9');
          }
        }
      }
    } else {
      setServiceName('');
      setServicePrice(0);
    }
  };

  const handleServiceChange = (name: string) => {
    setServiceName(name);
    if (!mainCategory) return;
    const found = GURUDEV_SERVICES[mainCategory]?.find((s) => s.name === name);
    if (found) {
      setServicePrice(found.price);
      setTitle(found.name);
      if (mainCategory === 'design') {
        setCategory('other');
        setAspectRatio('1:1');
      } else {
        if (name.toLowerCase().includes('reel') || name.toLowerCase().includes('status')) {
          setCategory('reels_shorts');
          setAspectRatio('9:16');
        } else if (name.toLowerCase().includes('wedding')) {
          setCategory('cinematic_wedding');
          setAspectRatio('16:9');
        } else {
          setCategory('youtube_vlog');
          setAspectRatio('16:9');
        }
      }
    }
  };

  if (!isOpen) return null;

  // Calculate dynamic price
  const estimatedPrice = servicePrice > 0 ? servicePrice : calculateEstimatedPrice({
    category,
    durationMinutes,
    rushDelivery,
    includeSubtitles,
    soundDesign,
    colorGrading,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleVideoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim() || !clientPhone.trim() || !title.trim()) {
      setErrorMsg(
        lang === 'gu'
          ? 'કૃપા કરીને નામ, મોબાઇલ નંબર અને વિડિયો શીર્ષક ભરો.'
          : 'Please provide client name, phone number, and video title.'
      );
      return;
    }

    if (uploadMethod === 'cloud_link' && !cloudFootageUrl.trim()) {
      setErrorMsg(
        lang === 'gu'
          ? 'કૃપા કરીને Google Drive / Dropbox / WeTransfer ફૂટેજ લિંક આપો.'
          : 'Please provide a valid Google Drive, Dropbox, or WeTransfer footage link.'
      );
      return;
    }

    if (uploadMethod === 'file' && selectedFiles.length === 0) {
      setErrorMsg(
        lang === 'gu'
          ? 'કૃપા કરીને ઓછામાં ઓછી એક કાચી વિડિયો ફાઇલ પસંદ કરો અથવા ક્લાઉડ લિંક પસંદ કરો.'
          : 'Please select at least one video file or switch to Cloud Link.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const rawFileNames = selectedFiles.map((f) => f.name);

      let primaryFileData = uploadMethod === 'cloud_link' ? cloudFootageUrl.trim() : '';
      let primaryFileName = uploadMethod === 'cloud_link' ? 'client_cloud_footage_link' : '';
      const rawFileItems: RawFileItem[] = [];

      if (uploadMethod === 'file' && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          try {
            const saved = await saveRawFile('upload', i, file);
            rawFileItems.push({
              id: saved.id,
              name: saved.name,
              size: saved.size,
              type: saved.type,
              dataUrl: saved.dataUrl,
            });
          } catch (e) {
            console.error('File saving error', e);
          }
        }
        primaryFileData = rawFileItems[0]?.dataUrl || '';
        primaryFileName = rawFileItems[0]?.name || 'client_raw_video.mp4';
      }

      const newOrder = addOrder({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || `${clientPhone.trim()}@client.gurudev`,
        city: city.trim() || 'Gujarat',
        mainCategory: mainCategory || 'video',
        serviceName: serviceName || title.trim(),
        category,
        title: title.trim() || serviceName || 'Video Project',
        description: description.trim(),
        aspectRatio,
        durationMinutes,
        rushDelivery,
        includeSubtitles,
        soundDesign,
        colorGrading,
        uploadMethod,
        cloudFootageUrl: uploadMethod === 'cloud_link' ? cloudFootageUrl.trim() : undefined,
        rawFilesCount: uploadMethod === 'file' ? selectedFiles.length : undefined,
        rawFilesNames: uploadMethod === 'file' ? rawFileNames : undefined,
        fileData: primaryFileData,
        fileName: primaryFileName,
        rawFiles: rawFileItems,
        estimatedPrice,
        paymentStatus: 'pending',
        status: 'received',
      });

      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error creating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'gu' ? 'નવો વિડિયો ઓર્ડર નોંધાવો' : 'Book Video Editing Order'}
              </h2>
              <p className="text-xs text-neutral-400">
                {lang === 'gu'
                  ? 'Gurudev Creative_002 · ભાવ: ₹150 થી ₹2000'
                  : 'Gurudev Creative_002 · Transparent Pricing (₹150 - ₹2000)'}
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
          
          {/* Success Screen after Order Creation */}
          {createdOrder ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {lang === 'gu' ? 'ઓર્ડર સફળતાપૂર્વક સ્વીકારાયો!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                  {lang === 'gu'
                    ? 'તમારો ઓર્ડર ગુરુદેવ ક્રિએટિવ સિસ્ટમમાં નોંધાઈ ગયો છે. હવે તમે આ ID વડે કોઈપણ સમયે લાઇવ સ્ટેટસ ચેક કરી શકો છો.'
                    : 'Your project has been recorded in the studio queue. You can track live progress anytime using this Order ID.'}
                </p>
              </div>

              {/* Order ID Card */}
              <div className="max-w-sm mx-auto p-4 rounded-xl bg-neutral-950 border border-amber-500/30 text-center">
                <div className="text-xs text-neutral-400 mb-1">
                  {lang === 'gu' ? 'તમારો યુનિક ઓર્ડર ID:' : 'Your Unique Order ID:'}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-wider mb-2">
                  {createdOrder.id}
                </div>
                <button
                  onClick={handleCopyOrderId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-md transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? (lang === 'gu' ? 'કોપી થયું!' : 'Copied!') : (lang === 'gu' ? 'ID કોપી કરો' : 'Copy Order ID')}</span>
                </button>
              </div>

              {/* Summary Details */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-left text-xs space-y-2 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{lang === 'gu' ? 'ગ્રાહક:' : 'Client:'}</span>
                  <span className="font-semibold text-white">{createdOrder.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{lang === 'gu' ? 'પ્રોજેક્ટ:' : 'Project:'}</span>
                  <span className="text-white">{createdOrder.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{lang === 'gu' ? 'અંદાજિત ભાવ:' : 'Agreed Estimate:'}</span>
                  <span className="font-mono font-bold text-amber-400">₹{createdOrder.estimatedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{lang === 'gu' ? 'સ્ટેટસ:' : 'Status:'}</span>
                  <span className="text-amber-300 font-medium">{lang === 'gu' ? 'ઓર્ડર મળ્યો (Received)' : 'Order Received'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-2">
                {/* Instant Online Payment via Razorpay */}
                <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-amber-300 font-bold">
                    {lang === 'gu'
                      ? 'ઓનલાઇન પેમેન્ટ (Razorpay / UPI / Card):'
                      : 'Online Payment (Razorpay / UPI / Card):'}
                  </div>
                  <PayNowButton
                    amount={createdOrder.estimatedPrice}
                    orderId={createdOrder.id}
                    clientName={createdOrder.clientName}
                    clientPhone={createdOrder.clientPhone}
                    lang={lang}
                    variant="primary"
                  />
                  <div className="text-[10px] text-neutral-400">
                    {lang === 'gu'
                      ? 'સુરક્ષિત પેમેન્ટ ગેટવે · ₹150 થી ₹2000'
                      : 'Secure Payment Gateway · ₹150 to ₹2000'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/916353894486?text=${encodeURIComponent(
                      `નમસ્તે Gurudev Creative! મેં વેબસાઇટ પર નવો ઓર્ડર બુક કર્યો છે.\nOrder ID: ${createdOrder.id}\nનામ: ${createdOrder.clientName}\nવિડિયો: ${createdOrder.title}\nભાવ: ₹${createdOrder.estimatedPrice}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp 6353894486 (Main)</span>
                  </a>

                  <a
                    href={`https://wa.me/91990940414?text=${encodeURIComponent(
                      `નમસ્તે Gurudev Creative! નવો ઓર્ડર ID: ${createdOrder.id} - ${createdOrder.clientName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-neutral-900 border border-neutral-700 hover:border-emerald-500/40 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>990940414</span>
                  </a>

                  <a
                    href={`https://wa.me/919714171301?text=${encodeURIComponent(
                      `નમસ્તે Gurudev Creative! નવો ઓર્ડર ID: ${createdOrder.id} - ${createdOrder.clientName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-neutral-900 border border-neutral-700 hover:border-emerald-500/40 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>9714171301</span>
                  </a>
                </div>

                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800"
                  >
                    {lang === 'gu' ? 'ઓર્ડર પોર્ટલ બંધ કરો' : 'Close Window'}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Notice if any */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Client Information */}
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  {lang === 'gu' ? '૧. તમારી વિગતો (Client Details)' : '1. Client Details'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {lang === 'gu' ? 'તમારું પૂરું નામ *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={lang === 'gu' ? 'દા.ત. શ્યામ પટેલ' : 'e.g. Shyam Patel'}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {lang === 'gu' ? 'WhatsApp મોબાઇલ નંબર *' : 'WhatsApp Phone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder={lang === 'gu' ? 'દા.ત. 98250 12345' : 'e.g. 98250 12345'}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {lang === 'gu' ? 'ઇમેઇલ (Email Address)' : 'Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {lang === 'gu' ? 'શહેર / રાજ્ય (City)' : 'City / Location'}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={lang === 'gu' ? 'દા.ત. અમદાવાદ / સુરત' : 'e.g. Ahmedabad, Surat'}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Video Project Specs */}
              <div className="pt-2 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  {lang === 'gu' ? '૨. સર્વિસ અને પ્રોજેક્ટ માહિતી (Select Service)' : '2. Service & Project Specifications'}
                </h3>
                
                <div className="space-y-3">
                  {/* Two-level Service & Price Selector matching user's exact snippet */}
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          સર્વિસ કેટેગરી પસંદ કરો
                        </label>
                        <select
                          id="category"
                          value={mainCategory}
                          onChange={(e) => handleMainCategoryChange(e.target.value as MainCategory | '')}
                          className="w-full px-2.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:border-amber-400 focus:outline-none"
                        >
                          <option value="">Select Category</option>
                          <option value="video">Video Edit Service</option>
                          <option value="design">Designing Service</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          સર્વિસ પસંદ કરો
                        </label>
                        <select
                          id="serviceList"
                          disabled={!mainCategory}
                          value={serviceName}
                          onChange={(e) => handleServiceChange(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:border-amber-400 focus:outline-none disabled:opacity-50"
                        >
                          {!mainCategory && <option value="">પહેલાં કેટેગરી પસંદ કરો</option>}
                          {mainCategory &&
                            (GURUDEV_SERVICES[mainCategory] || []).map((item, idx) => (
                              <option key={idx} value={item.name}>
                                {item.name} - ₹{item.price}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Service Price (₹)
                        </label>
                        <input
                          type="number"
                          id="servicePrice"
                          readOnly
                          value={servicePrice}
                          className="w-full px-2.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-amber-400 font-mono font-bold focus:outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {lang === 'gu' ? 'વિડિયો પ્રોજેક્ટ નામ / ટાઇટલ *' : 'Video Title / Topic *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        lang === 'gu'
                          ? 'દા.ત. બિઝનેસ પ્રમોશન રીલ અથવા પોડકાસ્ટ એપિસોડ 1'
                          : 'e.g. Business Promotion Reel or Wedding Teaser'
                      }
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {lang === 'gu' ? 'કેટેગરી (Category)' : 'Category'}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as VideoCategory)}
                        className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="reels_shorts">ઇન્સ્ટાગ્રામ રીલ્સ / શોર્ટ્સ (₹150 - ₹350)</option>
                        <option value="youtube_vlog">યૂટ્યુબ વ્લોગ / ટ્યુટોરીયલ (₹400 - ₹850)</option>
                        <option value="brand_commercial">કોમર્શિયલ / બિઝનેસ એડ (₹900 - ₹1499)</option>
                        <option value="cinematic_wedding">વેડિંગ સિનેમેટિક હાઇલાઇટ (₹1200 - ₹2000)</option>
                        <option value="podcast_interview">પોડકાસ્ટ / ઇન્ટરવ્યુ (₹500 - ₹1200)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {lang === 'gu' ? 'વિડિયો ફોર્મેટ (Aspect Ratio)' : 'Aspect Ratio'}
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['9:16', '16:9', '1:1', '4:5'] as AspectRatioType[]).map((ar) => (
                          <button
                            key={ar}
                            type="button"
                            onClick={() => setAspectRatio(ar)}
                            className={`py-1.5 text-xs font-mono font-medium rounded-md border text-center transition-colors ${
                              aspectRatio === ar
                                ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {ar}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {lang === 'gu' ? 'એડિટિંગ સૂચનાઓ / પસંદગી' : 'Instructions & Creative Preferences'}
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        lang === 'gu'
                          ? 'કયા પ્રકારનું મ્યુઝિક જોઈએ, કયા ભાગ કટ કરવા, ક્યાં ટેક્સ્ટ મુકવા વગેરે વિગત લખો...'
                          : 'Specific cut instructions, reference reel link, music choice, or style...'
                      }
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Raw Footage Upload (User explicitly asked: વિડિયો અપલોડ) */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {lang === 'gu' ? '૩. કાચી વિડિયો ફૂટેજ અપલોડ (Video Upload) *' : '3. Raw Video Footage Upload *'}
                  </h3>
                  
                  {/* Upload Method Toggle */}
                  <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('cloud_link')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1 ${
                        uploadMethod === 'cloud_link'
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'gu' ? 'Drive / ક્લાઉડ લિંક' : 'Cloud Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1 ${
                        uploadMethod === 'file'
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'gu' ? 'ડાયરેક્ટ ફાઇલ અપલોડ' : 'Upload Files'}</span>
                    </button>
                  </div>
                </div>

                {uploadMethod === 'cloud_link' ? (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <label className="block text-xs text-neutral-300 font-medium">
                      {lang === 'gu'
                        ? 'Google Drive / Dropbox / WeTransfer લિંક અહીં પેસ્ટ કરો *'
                        : 'Paste Google Drive, Dropbox, or WeTransfer Folder Link *'}
                    </label>
                    <input
                      type="url"
                      value={cloudFootageUrl}
                      onChange={(e) => setCloudFootageUrl(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none font-mono"
                    />
                    <div className="text-[11px] text-neutral-400 leading-relaxed">
                      💡 {lang === 'gu'
                        ? 'નોંધ: ગૂગલ ડ્રાઇવ લિંકમાં "Anyone with the link can view/download" પરમિશન ઓન રાખવી.'
                        : 'Tip: Ensure your Drive or Dropbox folder permissions are set to "Anyone with the link can view/download".'}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                    {/* User requested: 📸 ફોટા પસંદ કરો & 🎥 વિડિયો પસંદ કરો */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Photo Selector */}
                      <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-amber-400/50 transition-all">
                        <label
                          htmlFor="photo-file-input"
                          className="block text-xs font-bold text-neutral-100 mb-2 cursor-pointer flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>📸</span>
                            <span>{lang === 'gu' ? 'ફોટા પસંદ કરો' : 'Select Photos'}</span>
                          </span>
                          {selectedFiles.filter((f) => f.type.startsWith('image/')).length > 0 && (
                            <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                              {selectedFiles.filter((f) => f.type.startsWith('image/')).length} {lang === 'gu' ? 'ફોટા' : 'photos'}
                            </span>
                          )}
                        </label>
                        <input
                          type="file"
                          id="photo-file-input"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoFilesChange}
                          className="w-full text-xs text-neutral-300 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-neutral-950 hover:file:bg-amber-300 cursor-pointer bg-neutral-950 p-2 rounded-lg border border-neutral-800 focus:outline-none"
                        />
                        <div className="text-[10px] text-neutral-500 mt-1.5">
                          JPG, PNG, WEBP, HEIC ({lang === 'gu' ? 'મલ્ટીપલ ફોટા સિલેક્ટ કરી શકો છો' : 'Multiple photos supported'})
                        </div>
                      </div>

                      {/* Video Selector */}
                      <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-amber-400/50 transition-all">
                        <label
                          htmlFor="video-file-input"
                          className="block text-xs font-bold text-neutral-100 mb-2 cursor-pointer flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>🎥</span>
                            <span>{lang === 'gu' ? 'વિડિયો પસંદ કરો' : 'Select Videos'}</span>
                          </span>
                          {selectedFiles.filter((f) => f.type.startsWith('video/')).length > 0 && (
                            <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                              {selectedFiles.filter((f) => f.type.startsWith('video/')).length} {lang === 'gu' ? 'વિડિયો' : 'videos'}
                            </span>
                          )}
                        </label>
                        <input
                          type="file"
                          id="video-file-input"
                          accept="video/*"
                          multiple
                          onChange={handleVideoFilesChange}
                          className="w-full text-xs text-neutral-300 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-neutral-950 hover:file:bg-amber-300 cursor-pointer bg-neutral-950 p-2 rounded-lg border border-neutral-800 focus:outline-none"
                        />
                        <div className="text-[10px] text-neutral-500 mt-1.5">
                          MP4, MOV, MKV, AVI ({lang === 'gu' ? 'મલ્ટીપલ વિડિયો ક્લિપ્સ' : 'Multiple video clips'})
                        </div>
                      </div>
                    </div>

                    {/* Drag & Drop or General File Upload Zone */}
                    <div className="border border-dashed border-neutral-700/80 rounded-xl p-3 text-center bg-neutral-900/40">
                      <input
                        type="file"
                        id="general-file-input"
                        multiple
                        accept="video/*,audio/*,image/*,.zip,.rar"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="general-file-input"
                        className="cursor-pointer flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'gu' ? 'અથવા અન્ય ઓડિયો / ZIP ફાઇલ્સ પસંદ કરો' : 'Or select Audio / ZIP / Project files'}</span>
                      </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                      <div className="text-left border-t border-neutral-800 pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-amber-400 font-semibold flex items-center gap-2">
                            <span>
                              {lang === 'gu' ? 'પસંદ કરેલી ફાઇલ્સ:' : 'Selected Files:'} {selectedFiles.length}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-normal">
                              ({selectedFiles.filter((f) => f.type.startsWith('image/')).length} 📸 ફોટા,{' '}
                              {selectedFiles.filter((f) => f.type.startsWith('video/')).length} 🎥 વિડિયો)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFiles([])}
                            className="text-[11px] text-rose-400 hover:text-rose-300 underline"
                          >
                            {lang === 'gu' ? 'બધા કાઢી નાખો' : 'Clear All'}
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {selectedFiles.map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-lg"
                            >
                              <div className="flex items-center gap-2 truncate max-w-[320px]">
                                <span>{f.type.startsWith('image/') ? '📸' : f.type.startsWith('video/') ? '🎥' : '📁'}</span>
                                <span className="truncate font-mono text-[11px]">{f.name}</span>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                <span className="text-[11px] text-neutral-500 font-mono">
                                  {(f.size / (1024 * 1024)).toFixed(1)} MB
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(i)}
                                  className="w-5 h-5 flex items-center justify-center rounded-md bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                                  title="Remove"
                                >
                                  &times;
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 4: Live Price Summary & Submit */}
              <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <div className="text-xs text-neutral-400">
                    {lang === 'gu' ? 'કુલ અંદાજિત ભાવ (Est. Total):' : 'Estimated Pricing:'}
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    ₹{estimatedPrice}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {lang === 'gu' ? 'ભાવ મર્યાદા: ₹150 થી ₹2000' : 'Strict Budget: ₹150 to ₹2000'}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-50 rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (lang === 'gu' ? 'ઓર્ડર સેવ થઈ રહ્યો છે...' : 'Booking...')
                      : (lang === 'gu' ? `ઓર્ડર કન્ફર્મ કરો (₹${estimatedPrice})` : `Confirm Order (₹${estimatedPrice})`)}
                  </span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
