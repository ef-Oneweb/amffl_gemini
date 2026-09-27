import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Building2, Smartphone, Wallet, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  email: string;
  userId: string;
  metadata?: {
    purpose: 'subscription' | 'promotion';
    planId?: string;
    planName?: string;
    duration?: string;
    listingId?: string;
    packageName?: string;
  };
  onSuccess: (reference: string, walletUsed: number) => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  isOpen,
  onClose,
  amount,
  email,
  userId,
  metadata,
  onSuccess,
}) => {
  const walletBalance = StorageService.getUserWalletBalance(userId);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(Math.min(walletBalance, amount));
  const [selectedChannel, setSelectedChannel] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('4084 0800 0000 0000');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('408');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'otp' | 'success'>('input');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const actualWalletUsed = useWallet ? Math.min(walletAmount, walletBalance, amount) : 0;
  const payableAmount = Math.max(0, amount - actualWalletUsed);

  const handlePay = () => {
    setIsProcessing(true);
    setStep('processing');

    setTimeout(() => {
      if (payableAmount === 0) {
        // Direct full wallet settlement!
        completePayment();
      } else {
        // Card OTP verification step
        setIsProcessing(false);
        setStep('otp');
      }
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      completePayment();
    }, 1000);
  };

  const completePayment = () => {
    const reference = `pstk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    setStep('success');
    setIsProcessing(false);

    setTimeout(() => {
      onSuccess(reference, actualWalletUsed);
      onClose();
      // Reset
      setStep('input');
      setUseWallet(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#001f3f] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-md">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURED BY PAYSTACK
              </div>
              <p className="text-xs text-slate-300 truncate max-w-[200px]">{email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-300 uppercase">Pay</p>
            <p className="text-xl font-extrabold text-white">₦{payableAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'input' && (
            <div className="space-y-5">
              {/* Metadata summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 flex justify-between items-center">
                <span className="font-medium text-slate-500">Item:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[240px]">
                  {metadata?.planName || metadata?.packageName || 'AMFFL Marketplace Service'}
                </span>
              </div>

              {/* Wallet Split Option */}
              {walletBalance > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 transition-all">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="wallet-split"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="wallet-split" className="text-xs text-emerald-950 flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" /> Apply AMFFL Wallet Balance
                        </span>
                        <span className="font-semibold text-emerald-800">
                          ₦{walletBalance.toLocaleString()} available
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1">
                        Deduct up to ₦{Math.min(walletBalance, amount).toLocaleString()} from your earned wallet credits.
                      </p>
                    </label>
                  </div>

                  {useWallet && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-800">Wallet deduction:</span>
                      <span className="font-bold text-emerald-900">-₦{actualWalletUsed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* If full amount covered by wallet */}
              {payableAmount === 0 ? (
                <div className="bg-emerald-100/70 border border-emerald-300 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-900">Covered 100% by Wallet Credits</p>
                  <p className="text-xs text-emerald-700">No card payment required! Click below to complete activation.</p>
                </div>
              ) : (
                <>
                  {/* Channels Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('card')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        selectedChannel === 'card'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600" /> Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('bank')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        selectedChannel === 'bank'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-emerald-600" /> Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedChannel('ussd')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        selectedChannel === 'ussd'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" /> USSD
                    </button>
                  </div>

                  {/* Channel Content */}
                  {selectedChannel === 'card' && (
                    <div className="space-y-3.5 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Valid Till
                          </label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cvv}
                            maxLength={3}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Demo test card pre-filled</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber('4084 0800 0000 0000');
                            setExpiry('12/28');
                            setCvv('408');
                          }}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Use Test Card
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedChannel === 'bank' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                      <p className="text-xs text-slate-600">Pay to Paystack Titan Virtual Account:</p>
                      <p className="text-xl font-bold font-mono text-slate-900 tracking-wider">9948210394</p>
                      <p className="text-xs font-semibold text-emerald-800">Titan Trust Bank / Paystack</p>
                      <p className="text-[11px] text-slate-500">Expires in 30 minutes. Account created for this session.</p>
                    </div>
                  )}

                  {selectedChannel === 'ussd' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                      <p className="text-xs text-slate-600">Dial on your registered phone number:</p>
                      <p className="text-xl font-bold font-mono text-emerald-800 tracking-wider">*737*50*001*94#</p>
                      <p className="text-[11px] text-slate-500">Supports GTBank, Access, Zenith, UBA, and First Bank.</p>
                    </div>
                  )}
                </>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Pay ₦{payableAmount.toLocaleString()}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
              <div>
                <p className="text-base font-bold text-slate-800">Contacting Your Bank...</p>
                <p className="text-xs text-slate-500 mt-1">Please do not refresh or close this window.</p>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4 py-4">
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-900">Authorize Payment</p>
                <p className="text-xs text-slate-500">
                  Enter the one-time passcode sent to your phone or use test code: <strong className="text-emerald-700 font-mono">123456</strong>
                </p>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-2xl font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Authorize'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <p className="text-lg font-bold text-slate-900">Payment Successful!</p>
              <p className="text-xs text-slate-500">Redirecting to your AMFFL dashboard...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200 text-center flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-bit SSL Encryption
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
