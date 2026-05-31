import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { MessageSquare, ArrowRight, ClipboardCheck, Info, CheckCircle, ShieldCheck } from 'lucide-react';
import { OrderFormData } from '../types';

interface OrderFormProps {
  selectedPackage: string;
  setSelectedPackage: (val: string) => void;
}

export default function OrderForm({ selectedPackage, setSelectedPackage }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    postcode: '',
    packageType: '',
    specialInstructions: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [formattedMsg, setFormattedMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Email Notification States
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error' | 'simulated'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  // Sync state when selectedPackage changes from parent
  useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({ ...prev, packageType: selectedPackage }));
    }
  }, [selectedPackage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Sync back if package selection is updated inside the form dropdown
    if (name === 'packageType') {
      setSelectedPackage(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const addressStr = `${formData.streetAddress}, ${formData.city}, ${formData.postcode}`;
    const notesStr = formData.specialInstructions.trim() ? formData.specialInstructions : 'None';

    const rawMessage = `Hi Paul! I'd like to place an order.\n\nName: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${addressStr}\nPackage: ${formData.packageType}\nNotes: ${notesStr}`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const mUrl = `https://www.facebook.com/messages/e2ee/t/5166288536929927?text=${encodedMessage}`;

    setFormattedMsg(rawMessage);
    setRedirectUrl(mUrl);
    setSubmitted(true);

    // Proceed to dispatch the email log to the backend
    setIsSendingEmail(true);
    setEmailStatus('idle');
    try {
      const response = await fetch('/api/order-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        if (resData.status === 'simulated') {
          setEmailStatus('simulated');
          setEmailMessage(resData.message || '');
        } else {
          setEmailStatus('success');
        }
      } else {
        setEmailStatus('error');
        setEmailMessage(resData.details || resData.error || 'Failed to dispatch email notification.');
      }
    } catch (err: any) {
      console.error('Mailing dispatch failed:', err);
      setEmailStatus('error');
      setEmailMessage(err?.message || 'Network error linking to backend script.');
    } finally {
      setIsSendingEmail(false);
    }

    // Attempt an immediate open just in case browser context allows it
    try {
      window.open(mUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.log('Immediate popups were blocked, showing manual redirect screen.', e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmailStatus('idle');
    setEmailMessage('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      postcode: '',
      packageType: selectedPackage || "Loaded Fire TV Stick 4K — £70",
      specialInstructions: '',
    });
  };

  return (
    <section id="order-form" className="bg-[#0a0a0a] py-20 border-b border-white/5 scroll-mt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* FORM STATUS/CONTAINER CARD */}
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 sm:p-10 shadow-2xl relative">
          
          {/* Accent decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-32 bg-[#FF6B00] rounded-b-md" />

          {!submitted ? (
            <>
              {/* HEADER COPIES */}
              <div className="mb-8 text-center sm:text-left">
                <span className="text-xs uppercase font-bold tracking-widest text-[#FF6B00]">SECURE ORDERING</span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-1 leading-none">
                  Place Your Order
                </h2>
                <p className="mt-3 text-sm text-[#a0a0a0] leading-relaxed">
                  Enter your details below. This will build a structured messenger text which opens directly formatted to Paul's personal workspace. Fast & secure!
                </p>
              </div>

              {/* INPUT FORM CONTENT */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SELECT PACKAGE */}
                <div>
                  <label htmlFor="packageType" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                    SELECT YOUR PACKAGE <span className="text-[#FF6B00]">*</span>
                  </label>
                  <select
                    id="packageType"
                    name="packageType"
                    required
                    value={formData.packageType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                  >
                    <option value="" disabled>-- Click To Select Package --</option>
                    <option value="Loaded Fire TV Stick 4K — £70">Loaded Fire TV Stick 4K — £70</option>
                    <option value="Subscription Only — £50">Subscription Only — £50</option>
                  </select>
                </div>

                {/* TWO COLUMN GENERAL STUFF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                      FULL NAME <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="e.g. Gary Smith"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                      PHONE NUMBER <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="e.g. 07123 456789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                    />
                  </div>
                </div>

                {/* EMAIL ADDRESS */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                    EMAIL ADDRESS <span className="text-[#FF6B00]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="e.g. garysmith@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                  />
                </div>

                {/* ADDRESS DETAILS */}
                <div className="space-y-4">
                  <div className="border-t border-white/5 pt-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">UK SHIPPING ADDRESS</span>
                  </div>

                  <div>
                    <label htmlFor="streetAddress" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                      STREET ADDRESS <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      required
                      placeholder="e.g. 15 North Road"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                        CITY / TOWN <span className="text-[#FF6B00]">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        placeholder="e.g. Saint Helens"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="postcode" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                        POSTCODE <span className="text-[#FF6B00]">*</span>
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        required
                        placeholder="e.g. WA10 1HP"
                        value={formData.postcode}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SPECIAL INSTRUCTIONS */}
                <div>
                  <label htmlFor="specialInstructions" className="block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-2">
                    SPECIAL INSTRUCTIONS <span className="text-white/40">(OPTIONAL)</span>
                  </label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    rows={3}
                    placeholder="e.g. Prefer delivery after 5 PM, or specific device notes"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none resize-none"
                  />
                </div>

                {/* TRUST BANNER */}
                <div className="rounded-xl bg-[#FF6B00]/5 border border-[#FF6B00]/15 p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div className="text-xs text-white/80 leading-relaxed">
                    <span className="font-bold text-white">Direct-to-Seller Messenger Flow:</span> Your data stays perfectly secure. We do not sell or store details in third-party marketing trackers. Paul receives your information instantly to verify delivery and logistics.
                  </div>
                </div>

                {/* SUBMIT */}
                <div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#FF6B00] py-4 text-center font-heading text-lg font-bold tracking-wider text-white transition-all duration-200 hover:bg-[#E05E00] shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>PROCEED TO MESSENGER</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

              </form>
            </>
          ) : (
            /* AFTER SUBMISSION SCREEN */
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-[#FF6B00] mx-auto mb-6" />
              
              <h2 className="font-heading text-3xl font-extrabold text-white mb-2 uppercase tracking-wide">
                Order Structured on Site!
              </h2>
              <p className="text-[#a0a0a0] text-sm max-w-md mx-auto mb-6">
                Your order description is compiled. To complete your purchase and authorize payment with Paul, click the big orange button below to send your details over Facebook Messenger.
              </p>

              {/* Email Backup Services Logger alert box */}
              <div className="max-w-md mx-auto mb-6 text-left text-xs text-white/90">
                {isSendingEmail && (
                  <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-3.5 flex items-center gap-3 animate-pulse">
                    <div className="h-4 w-4 rounded-full border-2 border-dashed border-[#FF6B00] animate-spin shrink-0" />
                    <div>
                      <span className="font-bold text-[#FF6B00] block">Syncing order record...</span>
                      <span className="text-white/60">Emailing dispatch copy directly to Paul's workspace.</span>
                    </div>
                  </div>
                )}

                {emailStatus === 'success' && (
                  <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-3.5 flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                    <div>
                      <span className="font-bold text-green-400 block">Record Emailed Successfully</span>
                      <span className="text-white/60">Paul has received an automated email copy of your transaction requirements!</span>
                    </div>
                  </div>
                )}

                {emailStatus === 'simulated' && (
                  <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-3.5 flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">ℹ</div>
                    <div>
                      <span className="font-bold text-blue-400 block">Transaction Log Simulating</span>
                      <span className="text-white/60">{emailMessage || 'Simulated mail dispatch successfully compiled!'}</span>
                    </div>
                  </div>
                )}

                {emailStatus === 'error' && (
                  <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3.5 flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-sans font-bold text-xs shrink-0 mt-0.5">!</div>
                    <div>
                      <span className="font-bold text-red-400 block">Record Log Warning</span>
                      <span className="text-white/60">{emailMessage || 'Trouble connecting backup script.'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* MESSENGER BUTTON */}
              <div className="space-y-4 max-w-md mx-auto">
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-[#FF6B00] py-4 text-center font-heading text-lg font-bold tracking-wider text-white transition-all hover:bg-[#E05E00] shadow-xl shadow-[#FF6B00]/10 flex items-center justify-center gap-3"
                >
                  <MessageSquare className="h-5 w-5 text-white fill-current" />
                  <span>OPEN MESSENGER TO SEND PLAN</span>
                </a>

                {/* BRIEF MANUALLY COPY TEXT FOR BACKUP */}
                <div className="bg-[#1c1c1c] rounded-xl p-4 border border-white/5 text-left mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold tracking-wide text-[#a0a0a0] uppercase flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-[#FF6B00]" />
                      Backup Order Text
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-all flex items-center gap-1"
                    >
                      <ClipboardCheck className="h-3 w-3" />
                      <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-white/90 bg-[#0f0f0f] p-3 rounded-lg overflow-x-auto select-all whitespace-pre-wrap leading-relaxed max-h-48">
                    {formattedMsg}
                  </pre>
                </div>
              </div>

              {/* RESET FORM FOR ANOTHER ORDER */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#a0a0a0] hover:text-white transition-colors underline"
                >
                  ← Go back and modify details
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
