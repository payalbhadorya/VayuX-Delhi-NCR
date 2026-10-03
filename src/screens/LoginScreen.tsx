import React, { useState, useEffect, useRef } from 'react';
import { ASSET_IMAGES } from '../data/stations';

interface LoginScreenProps {
  onSuccess: (contact: string, name?: string) => void;
  onBack?: () => void;
  theme?: 'dark' | 'light';
}

type AuthMethod = 'phone' | 'email';
type EmailAuthMode = 'otp' | 'password';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: '+91 (India)' },
  { code: '+1', country: 'US', label: '+1 (USA/Canada)' },
  { code: '+44', country: 'GB', label: '+44 (UK)' },
  { code: '+971', country: 'AE', label: '+971 (UAE)' },
  { code: '+65', country: 'SG', label: '+65 (Singapore)' },
  { code: '+61', country: 'AU', label: '+61 (Australia)' },
  { code: '+49', country: 'DE', label: '+49 (Germany)' }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, theme = 'dark' }) => {
  const isLight = theme === 'light';

  // Screen mode: Login vs Sign Up
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Auth method: Phone vs Email
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');

  // For Email: OTP vs Password
  const [emailAuthMode, setEmailAuthMode] = useState<EmailAuthMode>('otp');

  // Input states
  const [fullName, setFullName] = useState('Payal Bhadoriya');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [email, setEmail] = useState('payalbhadoriya009@gmail.com');
  const [password, setPassword] = useState('VayuX@2026');
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState<string | null>(null);
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState<string | null>(null);
  const [phoneOtpDigits, setPhoneOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [emailOtpDigits, setEmailOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Refs for OTP input navigation
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Reset OTP state when switching methods
  const handleSwitchMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setErrorMessage(null);
    setSuccessToast(null);
  };

  const handleSwitchLoginMode = (login: boolean) => {
    setIsLoginMode(login);
    setErrorMessage(null);
    setSuccessToast(null);
    setPhoneOtpSent(false);
    setEmailOtpSent(false);
    setPhoneOtpDigits(['', '', '', '', '', '']);
    setEmailOtpDigits(['', '', '', '', '', '']);
  };

  // Generate a random 6-digit OTP
  const createMockOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send Phone OTP
  const handleSendPhoneOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid mobile phone number.');
      return;
    }

    setErrorMessage(null);
    const code = createMockOtp();
    setGeneratedPhoneOtp(code);
    setPhoneOtpSent(true);
    setPhoneOtpDigits(['', '', '', '', '', '']);
    setResendCooldown(30);
    setSuccessToast(`SMS OTP sent to ${countryCode} ${phoneNumber}`);

    // Auto focus first OTP box
    setTimeout(() => {
      phoneOtpRefs.current[0]?.focus();
    }, 100);
  };

  // Send Email OTP
  const handleSendEmailOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage(null);
    const code = createMockOtp();
    setGeneratedEmailOtp(code);
    setEmailOtpSent(true);
    setEmailOtpDigits(['', '', '', '', '', '']);
    setResendCooldown(30);
    setSuccessToast(`Verification code sent to ${email}`);

    // Auto focus first OTP box
    setTimeout(() => {
      emailOtpRefs.current[0]?.focus();
    }, 100);
  };

  // Handle individual OTP digit change
  const handleOtpDigitChange = (
    value: string,
    index: number,
    isPhone: boolean
  ) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const digits = isPhone ? [...phoneOtpDigits] : [...emailOtpDigits];
    const refs = isPhone ? phoneOtpRefs : emailOtpRefs;

    digits[index] = cleanVal;
    if (isPhone) {
      setPhoneOtpDigits(digits);
    } else {
      setEmailOtpDigits(digits);
    }

    // Auto focus next box if digit entered
    if (cleanVal && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation in OTP
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    isPhone: boolean
  ) => {
    const digits = isPhone ? phoneOtpDigits : emailOtpDigits;
    const refs = isPhone ? phoneOtpRefs : emailOtpRefs;

    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  // Quick auto-fill helper
  const handleAutoFillOtp = (isPhone: boolean) => {
    const code = isPhone ? generatedPhoneOtp : generatedEmailOtp;
    if (!code) return;

    const chars = code.split('');
    if (isPhone) {
      setPhoneOtpDigits(chars);
      phoneOtpRefs.current[5]?.focus();
    } else {
      setEmailOtpDigits(chars);
      emailOtpRefs.current[5]?.focus();
    }
    setErrorMessage(null);
  };

  // Verify Phone OTP and login
  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = phoneOtpDigits.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    if (generatedPhoneOtp && entered !== generatedPhoneOtp && entered !== '123456') {
      setErrorMessage('Incorrect OTP code. Please verify or use the demo code.');
      return;
    }

    setErrorMessage(null);
    const fullContact = `${countryCode} ${phoneNumber}`;
    onSuccess(fullContact, isLoginMode ? undefined : fullName);
  };

  // Verify Email OTP and login
  const handleVerifyEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = emailOtpDigits.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    if (generatedEmailOtp && entered !== generatedEmailOtp && entered !== '123456') {
      setErrorMessage('Incorrect OTP code. Please verify or use the demo code.');
      return;
    }

    setErrorMessage(null);
    onSuccess(email, isLoginMode ? undefined : fullName);
  };

  // Standard Email password submit
  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your account password.');
      return;
    }
    setErrorMessage(null);
    onSuccess(email, isLoginMode ? undefined : fullName);
  };

  return (
    <div className={`relative flex flex-col w-full min-h-screen px-4 pb-8 overflow-hidden transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafd] text-[#1f1f1f]' : 'bg-[#0d1322] text-[#dde2f8]'
    }`}>
      {/* Ambient background decoration */}
      {!isLight && (
        <>
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-sky-cyan/20 via-secondary/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-80 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-2xl pointer-events-none -z-10" />
        </>
      )}

      <div className="w-full max-w-md mx-auto flex flex-col">
        {/* Top Brand & Header Section */}
        <header className="flex flex-col items-center text-center mt-5 mb-4">
          <div className="relative flex items-center justify-center w-20 h-20 mb-2">
            {!isLight && (
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-90 animate-pulse" />
            )}
            <img
              alt="VayuX Logo"
              className="relative w-18 h-18 object-contain drop-shadow-md z-10 rounded-2xl shadow-sm border border-black/5 dark:border-white/10"
              src={ASSET_IMAGES.logo}
            />
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full mb-1.5 shadow-xs border ${
            isLight
              ? 'bg-[#e8f0fe] text-[#0b57d0] border-[#c2e7ff]'
              : 'bg-[#242a3a]/80 text-secondary border-white/5'
          }`}>
            <span className="material-symbols-outlined text-sm leading-none">air</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Hyperlocal Atmosphere
            </span>
          </div>

          <h1 className={`font-headline-lg-mobile text-2xl sm:text-3xl font-bold mb-1 tracking-tight ${
            isLight ? 'text-[#1f1f1f]' : 'text-white'
          }`}>
            Welcome to VayuX
          </h1>
          <p className={`text-xs sm:text-sm max-w-xs leading-snug ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            {isLoginMode
              ? 'Sign in to access real-time AQI tracking and clean air telemetry.'
              : 'Create an account to personalize atmospheric alerts and health insights.'}
          </p>
        </header>

        {/* Segmented Auth Mode Switcher: Log In vs Sign Up */}
        <div className={`w-full p-1.5 rounded-full mb-3.5 flex relative transition-all border ${
          isLight
            ? 'bg-[#f0f4f9] border-[#dadce0]'
            : 'bg-[#080e1d]/80 border-white/5 shadow-inner'
        }`}>
          <button
            type="button"
            onClick={() => handleSwitchLoginMode(true)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              isLoginMode
                ? isLight
                  ? 'text-white bg-[#0b57d0] shadow-sm'
                  : 'text-[#00344d] bg-sky-cyan shadow-md'
                : isLight
                ? 'text-[#5f6368] hover:text-[#1f1f1f]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchLoginMode(false)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              !isLoginMode
                ? isLight
                  ? 'text-white bg-[#0b57d0] shadow-sm'
                  : 'text-[#00344d] bg-sky-cyan shadow-md'
                : isLight
                ? 'text-[#5f6368] hover:text-[#1f1f1f]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Sign Up</span>
          </button>
        </div>

        {/* Contact Method Selector: Phone No. vs Email */}
        <div className={`w-full grid grid-cols-2 gap-2 p-1 rounded-2xl mb-4 border transition-all ${
          isLight ? 'bg-white border-[#dadce0]' : 'bg-[#151b2b] border-white/10'
        }`}>
          <button
            type="button"
            onClick={() => handleSwitchMethod('phone')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMethod === 'phone'
                ? isLight
                  ? 'bg-[#e8f0fe] text-[#0b57d0] shadow-xs border border-[#c2e7ff]'
                  : 'bg-[#242a3a] text-sky-cyan shadow-sm border border-sky-cyan/30'
                : isLight
                ? 'text-[#5f6368] hover:text-[#1f1f1f]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">smartphone</span>
            <span>Phone Number</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMethod('email')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMethod === 'email'
                ? isLight
                  ? 'bg-[#e8f0fe] text-[#0b57d0] shadow-xs border border-[#c2e7ff]'
                  : 'bg-[#242a3a] text-sky-cyan shadow-sm border border-sky-cyan/30'
                : isLight
                ? 'text-[#5f6368] hover:text-[#1f1f1f]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">mail</span>
            <span>Email Address</span>
          </button>
        </div>

        {/* Notification Toast for Sent OTP */}
        {successToast && (
          <div className={`mb-3 p-3 rounded-2xl flex items-start gap-2.5 border animate-in fade-in duration-200 ${
            isLight
              ? 'bg-[#e6f4ea] border-[#ceead6] text-[#137333]'
              : 'bg-[#003824]/80 border-secondary/30 text-secondary'
          }`}>
            <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
            <div className="flex-1 text-xs">
              <span className="font-semibold block">{successToast}</span>
              {(authMethod === 'phone' && generatedPhoneOtp) && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] opacity-90">Demo OTP: <strong className="font-mono">{generatedPhoneOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleAutoFillOtp(true)}
                    className="underline text-[11px] font-bold cursor-pointer hover:opacity-80"
                  >
                    Auto-Fill Code
                  </button>
                </div>
              )}
              {(authMethod === 'email' && generatedEmailOtp) && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] opacity-90">Demo OTP: <strong className="font-mono">{generatedEmailOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleAutoFillOtp(false)}
                    className="underline text-[11px] font-bold cursor-pointer hover:opacity-80"
                  >
                    Auto-Fill Code
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Error Message Alert */}
        {errorMessage && (
          <div className={`mb-3 p-3 rounded-2xl flex items-center gap-2 border text-xs animate-in fade-in duration-200 ${
            isLight
              ? 'bg-[#fce8e6] border-[#fad2cf] text-[#d93025]'
              : 'bg-[#ef4444]/15 border-[#ef4444]/30 text-[#ef4444]'
          }`}>
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span className="font-medium flex-1">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Main Auth Form Container (Google Style in Day Mode) */}
        <section className={`rounded-3xl p-5 sm:p-6 shadow-xl mb-4 border transition-all ${
          isLight
            ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)] text-[#1f1f1f]'
            : 'bg-[#1e293b]/65 backdrop-blur-xl border-white/10 shadow-[#080e1d]/60 text-white'
        }`}>
          {/* ========================================================
              OPTION 1: PHONE NUMBER WITH OTP
              ======================================================== */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {/* Full Name for Sign Up */}
              {!isLoginMode && (
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-medium ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`} htmlFor="phone-full-name">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <span className={`material-symbols-outlined absolute left-3.5 select-none text-xl pointer-events-none ${
                      isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]/80'
                    }`}>
                      badge
                    </span>
                    <input
                      id="phone-full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Payal Bhadoriya"
                      className={`w-full text-sm pl-11 pr-4 py-3 rounded-2xl focus:outline-none transition-colors border ${
                        isLight
                          ? 'bg-[#f8fafd] text-[#1f1f1f] placeholder:text-[#747775] border-[#dadce0] focus:border-[#0b57d0]'
                          : 'bg-[#242a3a]/90 text-white placeholder:text-[#bec8d2]/50 border-white/5 focus:bg-[#2f3445]'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Phone Input Row */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-medium flex items-center gap-1 ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`} htmlFor="phone-number">
                    <span>Mobile Phone Number</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-sky-cyan/20 text-sky-cyan'
                    }`}>
                      SMS OTP
                    </span>
                  </label>
                  {phoneOtpSent && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneOtpSent(false);
                        setPhoneOtpDigits(['', '', '', '', '', '']);
                      }}
                      className={`text-[11px] font-semibold hover:underline cursor-pointer ${
                        isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
                      }`}
                    >
                      Change Number
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Country Code Select */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={phoneOtpSent}
                    className={`text-xs font-semibold py-3 px-3 rounded-2xl border transition-colors cursor-pointer focus:outline-none ${
                      isLight
                        ? 'bg-[#f8fafd] text-[#1f1f1f] border-[#dadce0] focus:border-[#0b57d0]'
                        : 'bg-[#242a3a]/90 text-white border-white/5 focus:bg-[#2f3445]'
                    } ${phoneOtpSent ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code} className={isLight ? 'bg-white text-black' : 'bg-[#1e293b] text-white'}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  {/* Phone input */}
                  <div className="relative flex-1 flex items-center">
                    <span className={`material-symbols-outlined absolute left-3 select-none text-[20px] pointer-events-none ${
                      isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]/80'
                    }`}>
                      call
                    </span>
                    <input
                      id="phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      placeholder="98765 43210"
                      disabled={phoneOtpSent}
                      className={`w-full text-sm pl-10 pr-3 py-3 rounded-2xl focus:outline-none transition-colors border tracking-wider font-mono ${
                        isLight
                          ? 'bg-[#f8fafd] text-[#1f1f1f] placeholder:text-[#747775] border-[#dadce0] focus:border-[#0b57d0]'
                          : 'bg-[#242a3a]/90 text-white placeholder:text-[#bec8d2]/50 border-white/5 focus:bg-[#2f3445]'
                      } ${phoneOtpSent ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* If OTP NOT sent yet -> Show "Send OTP" Button */}
              {!phoneOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  className={`w-full py-3 px-6 rounded-full font-headline-sm font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] ${
                    isLight
                      ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                      : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg shadow-primary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">send_to_mobile</span>
                  <span>Get OTP on Phone</span>
                </button>
              ) : (
                /* OTP Verification Boxes */
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 pt-1 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className={`text-xs font-semibold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                        Enter 6-digit SMS Code:
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoFillOtp(true)}
                        className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                          isLight ? 'text-[#0b57d0] hover:underline' : 'text-sky-cyan hover:underline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Auto-fill Demo</span>
                      </button>
                    </div>

                    {/* 6 Digit Inputs */}
                    <div className="grid grid-cols-6 gap-2">
                      {phoneOtpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            phoneOtpRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(e.target.value, idx, true)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx, true)}
                          className={`w-full h-12 text-center text-lg font-bold rounded-xl focus:outline-none transition-all border ${
                            digit
                              ? isLight
                                ? 'bg-white border-[#0b57d0] text-[#0b57d0] shadow-sm'
                                : 'bg-[#242a3a] border-sky-cyan text-sky-cyan shadow-sm'
                              : isLight
                              ? 'bg-[#f8fafd] border-[#dadce0] text-[#1f1f1f] focus:border-[#0b57d0]'
                              : 'bg-[#151b2b] border-white/10 text-white focus:border-sky-cyan'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Resend Action */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className={isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}>
                        Didn't receive the SMS?
                      </span>
                      {resendCooldown > 0 ? (
                        <span className={`font-mono font-medium ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
                          Resend in {resendCooldown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendPhoneOtp()}
                          className={`font-semibold hover:underline cursor-pointer ${
                            isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
                          }`}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verify & Proceed CTA */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 px-6 rounded-full font-headline-sm font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] ${
                      isLight
                        ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                        : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg shadow-primary/20'
                    }`}
                  >
                    <span>{isLoginMode ? 'Verify & Log In' : 'Verify & Create Account'}</span>
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              OPTION 2: EMAIL (WITH CHOICE OF OTP OR PASSWORD)
              ======================================================== */}
          {authMethod === 'email' && (
            <div className="space-y-4">
              {/* Full Name for Sign Up */}
              {!isLoginMode && (
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-medium ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`} htmlFor="email-full-name">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <span className={`material-symbols-outlined absolute left-3.5 select-none text-xl pointer-events-none ${
                      isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]/80'
                    }`}>
                      badge
                    </span>
                    <input
                      id="email-full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Payal Bhadoriya"
                      className={`w-full text-sm pl-11 pr-4 py-3 rounded-2xl focus:outline-none transition-colors border ${
                        isLight
                          ? 'bg-[#f8fafd] text-[#1f1f1f] placeholder:text-[#747775] border-[#dadce0] focus:border-[#0b57d0]'
                          : 'bg-[#242a3a]/90 text-white placeholder:text-[#bec8d2]/50 border-white/5 focus:bg-[#2f3445]'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Email Address Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-medium flex items-center gap-1 ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`} htmlFor="email-input">
                    <span>Email Address</span>
                  </label>
                  {emailOtpSent && emailAuthMode === 'otp' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmailOtpSent(false);
                        setEmailOtpDigits(['', '', '', '', '', '']);
                      }}
                      className={`text-[11px] font-semibold hover:underline cursor-pointer ${
                        isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
                      }`}
                    >
                      Change Email
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className={`material-symbols-outlined absolute left-3.5 select-none text-xl pointer-events-none ${
                    isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]/80'
                  }`}>
                    mail
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="payalbhadoriya009@gmail.com"
                    disabled={emailOtpSent && emailAuthMode === 'otp'}
                    className={`w-full text-sm pl-11 pr-4 py-3 rounded-2xl focus:outline-none transition-colors border ${
                      isLight
                        ? 'bg-[#f8fafd] text-[#1f1f1f] placeholder:text-[#747775] border-[#dadce0] focus:border-[#0b57d0]'
                        : 'bg-[#242a3a]/90 text-white placeholder:text-[#bec8d2]/50 border-white/5 focus:bg-[#2f3445]'
                    } ${(emailOtpSent && emailAuthMode === 'otp') ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {/* Email Sub-Mode Switcher: OTP vs Password */}
              <div className={`flex items-center justify-between p-1 rounded-xl border text-xs ${
                isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setEmailAuthMode('otp');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    emailAuthMode === 'otp'
                      ? isLight
                        ? 'bg-white text-[#0b57d0] font-bold shadow-xs'
                        : 'bg-[#242a3a] text-sky-cyan font-bold shadow-sm'
                      : isLight
                      ? 'text-[#5f6368]'
                      : 'text-[#bec8d2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">pin</span>
                  <span>Email OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailAuthMode('password');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    emailAuthMode === 'password'
                      ? isLight
                        ? 'bg-white text-[#0b57d0] font-bold shadow-xs'
                        : 'bg-[#242a3a] text-sky-cyan font-bold shadow-sm'
                      : isLight
                      ? 'text-[#5f6368]'
                      : 'text-[#bec8d2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  <span>Password</span>
                </button>
              </div>

              {/* Sub-Path 1: Email OTP */}
              {emailAuthMode === 'otp' && (
                <div>
                  {!emailOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      className={`w-full py-3 px-6 rounded-full font-headline-sm font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] ${
                        isLight
                          ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                          : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg shadow-primary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">forward_to_inbox</span>
                      <span>Send OTP to Email</span>
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyEmailOtp} className="space-y-4 pt-1 animate-in fade-in duration-200">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className={`text-xs font-semibold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                            Enter 6-digit Email Code:
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAutoFillOtp(false)}
                            className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                              isLight ? 'text-[#0b57d0] hover:underline' : 'text-sky-cyan hover:underline'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                            <span>Auto-fill Demo</span>
                          </button>
                        </div>

                        {/* 6 Digit Inputs */}
                        <div className="grid grid-cols-6 gap-2">
                          {emailOtpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                emailOtpRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpDigitChange(e.target.value, idx, false)}
                              onKeyDown={(e) => handleOtpKeyDown(e, idx, false)}
                              className={`w-full h-12 text-center text-lg font-bold rounded-xl focus:outline-none transition-all border ${
                                digit
                                  ? isLight
                                    ? 'bg-white border-[#0b57d0] text-[#0b57d0] shadow-sm'
                                    : 'bg-[#242a3a] border-sky-cyan text-sky-cyan shadow-sm'
                                  : isLight
                                  ? 'bg-[#f8fafd] border-[#dadce0] text-[#1f1f1f] focus:border-[#0b57d0]'
                                  : 'bg-[#151b2b] border-white/10 text-white focus:border-sky-cyan'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Resend Action */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className={isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}>
                            Didn't receive the email?
                          </span>
                          {resendCooldown > 0 ? (
                            <span className={`font-mono font-medium ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
                              Resend in {resendCooldown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendEmailOtp()}
                              className={`font-semibold hover:underline cursor-pointer ${
                                isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
                              }`}
                            >
                              Resend Email Code
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Verify CTA */}
                      <button
                        type="submit"
                        className={`w-full py-3.5 px-6 rounded-full font-headline-sm font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] ${
                          isLight
                            ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                            : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg shadow-primary/20'
                        }`}
                      >
                        <span>{isLoginMode ? 'Verify Email & Log In' : 'Verify & Create Account'}</span>
                        <span className="material-symbols-outlined text-lg">verified</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Sub-Path 2: Email Password */}
              {emailAuthMode === 'password' && (
                <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className={`text-xs font-medium ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`} htmlFor="password-field">
                        Password
                      </label>
                      {isLoginMode && (
                        <button
                          type="button"
                          onClick={() => {
                            setEmailAuthMode('otp');
                            handleSendEmailOtp();
                          }}
                          className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                            isLight ? 'text-[#0b57d0] hover:underline' : 'text-primary hover:text-sky-cyan'
                          }`}
                        >
                          Login with OTP instead?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center group">
                      <span className={`material-symbols-outlined absolute left-3.5 select-none text-xl transition-colors pointer-events-none ${
                        isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]/80'
                      }`}>
                        lock
                      </span>
                      <input
                        id="password-field"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className={`w-full text-sm pl-11 pr-12 py-3 rounded-2xl focus:outline-none transition-colors border ${
                          isLight
                            ? 'bg-[#f8fafd] text-[#1f1f1f] placeholder:text-[#747775] border-[#dadce0] focus:border-[#0b57d0]'
                            : 'bg-[#242a3a]/90 text-white placeholder:text-[#bec8d2]/50 border-white/5 focus:bg-[#2f3445]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPassword((prev) => !prev);
                        }}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        className={`absolute right-3 p-1.5 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 ${
                          showPassword
                            ? isLight
                              ? 'text-[#0b57d0] bg-[#e8f0fe]'
                              : 'text-sky-cyan bg-sky-cyan/20'
                            : isLight
                            ? 'text-[#5f6368] hover:text-[#1f1f1f] hover:bg-slate-100'
                            : 'text-[#bec8d2] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] select-none">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 px-6 rounded-full font-headline-sm font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] ${
                      isLight
                        ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                        : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg shadow-primary/20'
                    }`}
                  >
                    <span>{isLoginMode ? 'Log In with Password' : 'Create Account'}</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Auth Divider */}
          <div className="flex items-center my-4">
            <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
            <span className={`px-3 text-[10px] uppercase tracking-wider ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
              or continue with
            </span>
            <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
          </div>

          {/* Quick Social Login Pills */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSuccess('payalbhadoriya009@gmail.com', 'Payal Bhadoriya')}
              className={`w-full py-2.5 px-4 rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer border ${
                isLight
                  ? 'bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0] shadow-xs'
                  : 'bg-[#242a3a] hover:bg-[#2f3445] text-white border-white/5 shadow-sm'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"
                  fill="#EA4335"
                />
                <path
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  fill="#4285F4"
                />
                <path
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.2-6.7-5.3L1.6 15.9C3.5 19.8 7.4 23 12 23z"
                  fill="#34A853"
                />
              </svg>
              <span className="text-xs font-semibold">Google</span>
            </button>

            <button
              type="button"
              onClick={() => onSuccess('payalbhadoriya009@gmail.com', 'Payal Bhadoriya')}
              className={`w-full py-2.5 px-4 rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer border ${
                isLight
                  ? 'bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0] shadow-xs'
                  : 'bg-[#242a3a] hover:bg-[#2f3445] text-white border-white/5 shadow-sm'
              }`}
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96 1-3.11-.97.04-2.15.65-2.85 1.47-.61.71-1.14 1.87-1 3 .01 0 .07.01.1.01 1-.01 2.08-.55 2.75-1.37z" />
              </svg>
              <span className="text-xs font-semibold">Apple</span>
            </button>
          </div>
        </section>

        {/* Switch View Link */}
        <div className="flex items-center justify-center gap-1.5 mb-5 text-center text-xs">
          <span className={isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}>
            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={() => handleSwitchLoginMode(!isLoginMode)}
            className={`font-semibold hover:underline focus:outline-none cursor-pointer ${
              isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
            }`}
          >
            {isLoginMode ? 'Sign Up' : 'Log In'}
          </button>
        </div>

        {/* Trust & Privacy Security Badge */}
        <footer className={`mt-auto flex items-center justify-center gap-2 p-3 rounded-2xl text-center border ${
          isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#080e1d]/60 border-white/5'
        }`}>
          <span className={`material-symbols-outlined text-base flex-shrink-0 ${
            isLight ? 'text-[#137333]' : 'text-secondary'
          }`}>
            verified_user
          </span>
          <p className={`text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            Encrypted &amp; Privacy-First atmospheric health data access
          </p>
        </footer>
      </div>
    </div>
  );
};
