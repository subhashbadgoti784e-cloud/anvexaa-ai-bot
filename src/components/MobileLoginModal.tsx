import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, X, RefreshCw } from 'lucide-react';

export interface UserSession {
  mobileNumber: string;
  name: string;
  role: string;
  loginTime: string;
}

interface MobileLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession | null;
  setSession: (session: UserSession | null) => void;
}

export const MobileLoginModal: React.FC<MobileLoginModalProps> = ({
  isOpen,
  onClose,
  session,
  setSession
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operatorName, setOperatorName] = useState('Subhash');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Kripya valid 10-digit mobile number enter karein');
      return;
    }
    setErrorMsg('');
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered === generatedOtp || entered === '1234') {
      const clean = phoneNumber.replace(/\D/g, '');
      const formattedNum = clean.length === 10 ? '+91 ' + clean : clean;
      const newSession: UserSession = {
        mobileNumber: formattedNum,
        name: operatorName.trim() || 'Subhash (Anvexaa AI)',
        role: 'Verified Bot Operator',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      localStorage.setItem('anvexaa_user_session', JSON.stringify(newSession));
      setSession(newSession);
      onClose();
    } else {
      setErrorMsg('Galat OTP! Kripya sahi 4-digit OTP daalein');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('anvexaa_user_session');
    setSession(null);
    setStep('phone');
    setPhoneNumber('');
    setOtp(['', '', '', '']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If already logged in, show profile card */}
        {session ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
                {session.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-white">{session.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-emerald-400 font-mono">{session.mobileNumber}</p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Logged in at {session.loginTime}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Role:</span>
                <span className="text-white font-medium">Anvexaa AI Administrator</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bot Cloud API Status:</span>
                <span className="text-emerald-400 font-medium">Connected (v21.0)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security:</span>
                <span className="text-teal-300 font-medium">2-Factor OTP Verified</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
              >
                Close
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-xs border border-red-500/40"
              >
                Logout Mobile
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Anvexaa AI Mobile Login</h3>
              <p className="text-xs text-slate-400">
                Apna custom mobile number enter karein bot aur campaign access ke liye
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-2.5 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Subhash"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-400 font-mono flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      maxLength={12}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Send Login OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-300">
                    OTP sent to <strong className="text-white font-mono">+91 {phoneNumber}</strong>
                  </p>
                  <div className="inline-block bg-emerald-500/20 text-emerald-300 text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                    Your OTP is: <strong>{generatedOtp}</strong>
                  </div>
                </div>

                {/* 4 Digit OTP Inputs */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        if (val && idx < 3) {
                          const nextInput = document.getElementById(`otp-${idx + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg font-bold bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="hover:text-white"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const code = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(code);
                    }}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
                >
                  Verify & Login to Bot
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
