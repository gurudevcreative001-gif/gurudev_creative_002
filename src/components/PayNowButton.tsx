import React, { useState } from 'react';
import { CreditCard, Loader2, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, HelpCircle, X } from 'lucide-react';
import { handle as createPaymentOrder } from '../api/createRazorpayOrder';
import { Language } from '../types';

interface PayNowButtonProps {
  amount?: number;
  orderId?: string;
  clientName?: string;
  clientPhone?: string;
  lang?: Language;
  className?: string;
  variant?: 'primary' | 'secondary' | 'badge';
  onSuccess?: () => void;
  showPinHelp?: boolean;
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({
  amount = 500,
  orderId,
  clientName,
  clientPhone,
  lang = 'gu',
  className = '',
  variant = 'primary',
  onSuccess,
  showPinHelp = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handlePayNow = async () => {
    setLoading(true);
    setNotice(null);

    // Call the Razorpay Order creation backend handler
    try {
      const clampedAmount = Math.max(150, Math.min(2000, Math.round(amount)));
      
      // First try fetching backend endpoint if available, else call handle directly
      let resData: any = null;
      try {
        const fetchRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: clampedAmount, orderId }),
        });
        if (fetchRes.ok) {
          resData = await fetchRes.json();
        }
      } catch {
        // Fallback to local handler module execution
      }

      if (!resData) {
        const dummyReq = new Request('http://localhost/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: clampedAmount, orderId }),
        });
        const handlerRes = await createPaymentOrder(dummyReq);
        resData = await handlerRes.json();
      }

      // If Razorpay keys are configured and order is generated:
      if (resData && resData.orderId && resData.keyId && typeof window !== 'undefined') {
        const win = window as any;
        if (win.Razorpay) {
          const rzp = new win.Razorpay({
            key: resData.keyId,
            amount: resData.amount,
            currency: resData.currency || 'INR',
            name: 'Gurudev Creative_002',
            description: `Video Editing Order ${orderId || ''}`,
            order_id: resData.orderId,
            prefill: {
              name: clientName || '',
              contact: clientPhone || '',
            },
            theme: { color: '#f59e0b' },
            handler: function (response: any) {
              setNotice(lang === 'gu' ? 'ચુકવણી સફળ થઈ ગઈ!' : 'Payment Successful!');
              onSuccess?.();
            },
          });
          rzp.open();
          setLoading(false);
          return;
        }
      }

      // Default prompt alert as requested: "Razorpay સેટઅપ થયા પછી Payment ચાલુ થશે."
      const alertMsg = 'Razorpay સેટઅપ થયા પછી Payment ચાલુ થશે.';
      try {
        alert(alertMsg);
      } catch {
        // In iframe environments where alert may be blocked
      }
      setNotice(alertMsg);
      setTimeout(() => setNotice(null), 5000);
    } catch {
      const alertMsg = 'Razorpay સેટઅપ થયા પછી Payment ચાલુ થશે.';
      try {
        alert(alertMsg);
      } catch {}
      setNotice(alertMsg);
      setTimeout(() => setNotice(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const baseStyle =
    variant === 'badge'
      ? 'px-3 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/20 active:scale-95'
      : variant === 'secondary'
      ? 'px-4 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg inline-flex items-center gap-2 transition-all active:scale-95'
      : 'px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20';

  return (
    <div className="inline-flex flex-col items-center gap-1.5 relative">
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handlePayNow}
          disabled={loading}
          className={`${baseStyle} ${className}`}
          title="Pay Now (Razorpay)"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          <span>Pay Now</span>
          {amount && (
            <span className="font-mono text-xs opacity-90">
              (₹{Math.max(150, Math.min(2000, Math.round(amount)))})
            </span>
          )}
        </button>

        {showPinHelp && (
          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
            title={lang === 'gu' ? 'Razorpay PIN / UPI PIN માહિતી' : 'Razorpay PIN / UPI PIN Info'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {notice && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 w-64 p-2.5 rounded-lg bg-neutral-900 border border-amber-500/40 text-amber-300 text-[11px] font-medium text-center shadow-xl animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold">સૂચના / Notice</span>
          </div>
          <p>{notice}</p>
        </div>
      )}

      {/* Razorpay PIN / UPI PIN Info Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative text-neutral-100">
            <button
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {lang === 'gu' ? 'Razorpay PIN & UPI PIN માર્ગદર્શિકા' : 'Razorpay PIN & UPI PIN Guide'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {lang === 'gu' ? 'સુરક્ષિત પેમેન્ટ માટે જરૂરી માહિતી' : 'Important Payment Security Details'}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <p className="font-semibold text-amber-300 mb-1">
                  💡 {lang === 'gu' ? 'Razorpay નો કોઈ અલગ PIN નથી હોતો:' : 'Razorpay does not have a separate PIN:'}
                </p>
                <p className="leading-relaxed">
                  {lang === 'gu'
                    ? 'Razorpay એ એક સુરક્ષિત પેમેન્ટ ગેટવે છે. જ્યારે તમે Pay Now કરો છો, ત્યારે PIN ફક્ત તમારી પોતાની બેંકનો 4 અથવા 6 અંકનો ગુપ્ત UPI PIN હોય છે.'
                    : 'Razorpay is a payment gateway. When paying via UPI, you only enter your bank\'s secret 4 or 6 digit UPI PIN inside your UPI app.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-neutral-200 text-xs">
                  {lang === 'gu' ? 'મુખ્ય મુદ્દાઓ (Key Points):' : 'Key Guidelines:'}
                </h4>
                <ul className="space-y-2 list-disc list-inside text-neutral-400">
                  <li>
                    <strong className="text-neutral-200">
                      {lang === 'gu' ? 'UPI એપમાં જ દાખલ કરો: ' : 'Only enter in UPI App: '}
                    </strong>
                    {lang === 'gu'
                      ? 'PhonePe, Google Pay કે Paytm એપમાં જ તમારો UPI PIN દાખલ કરો. કોઈપણ વેબસાઇટ પર PIN પૂછવામાં આવતો નથી.'
                      : 'Always enter your UPI PIN inside PhonePe, GPay, or Paytm directly.'}
                  </li>
                  <li>
                    <strong className="text-neutral-200">
                      {lang === 'gu' ? 'કાર્ડ પેમેન્ટ માટે OTP: ' : 'Cards require Bank OTP: '}
                    </strong>
                    {lang === 'gu'
                      ? 'ડેબિટ/ક્રેડિટ કાર્ડમાં તમારા રજિસ્ટર્ડ મોબાઈલ પર બેંકનો OTP આવે છે.'
                      : 'Card payments require a 3D Secure OTP sent to your registered mobile number.'}
                  </li>
                  <li>
                    <strong className="text-amber-300">
                      {lang === 'gu' ? 'સુરક્ષા ચેતવણી: ' : 'Security Alert: '}
                    </strong>
                    {lang === 'gu'
                      ? 'પૈસા મેળવવા કે રિફંડ માટે ક્યારેય PIN ની જરૂર હોતી નથી. કોઈ અજાણ્યા સાથે PIN શેર કરશો નહીં.'
                      : 'You NEVER need to enter a PIN to receive money or refunds. Never share your PIN with anyone.'}
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <p className="text-[11px] text-neutral-400">
                  <span className="text-amber-400 font-semibold">Admin / સેટઅપ માટે: </span>
                  {lang === 'gu'
                    ? 'Razorpay સેટઅપમાં PIN નહીં પરંતુ RAZORPAY_KEY_ID અને RAZORPAY_KEY_SECRET ની જરૂર પડે છે.'
                    : 'For developer setup, Razorpay uses Key ID and Key Secret, not a PIN.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPinModalOpen(false)}
              className="mt-5 w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl transition-all"
            >
              {lang === 'gu' ? 'સમજાઈ ગયું (Understood)' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
