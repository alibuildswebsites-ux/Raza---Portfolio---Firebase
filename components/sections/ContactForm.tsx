import React, { useState } from 'react';
import PixelButton from '../ui/PixelButton';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    // RATE LIMITING
    const LAST_SUBMISSION_KEY = 'last_contact_submission';
    const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes
    const lastSubmission = localStorage.getItem(LAST_SUBMISSION_KEY);
    
    if (lastSubmission && Date.now() - parseInt(lastSubmission) < RATE_LIMIT_MS) {
      setFormStatus('error');
      setErrorMessage("Please wait 5 minutes before sending another message.");
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
      return;
    }

    const SERVICE_ID = import.meta.env?.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env?.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env?.VITE_EMAILJS_PUBLIC_KEY;

    const messagePayload = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      message: contactForm.message.trim()
    };

    const templateParams = {
      from_name: messagePayload.name,
      from_email: messagePayload.email,
      phone: messagePayload.phone,
      message: messagePayload.message,
      to_name: "Raza A." 
    };

    try {
      // Persist the lead first so inbox records are not lost if email delivery fails.
      const db = await import('../../services/storage');
      await db.saveMessage(messagePayload);

      // Send the notification after the message is safely stored.
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        try {
          const emailjs = (await import('@emailjs/browser')).default;
          await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        } catch (emailError) {
          console.warn('Message saved, but EmailJS notification failed:', emailError);
        }
      } else {
        console.warn('Message saved, but EmailJS notification was skipped because configuration is missing.');
      }
      
      // Update Rate Limit Key
      localStorage.setItem(LAST_SUBMISSION_KEY, Date.now().toString());
      
      setFormStatus('success');
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    } catch (err) {
      console.error('Contact form submission error:', err);
      setFormStatus('error');
      setErrorMessage("Something went wrong. Please try again.");
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-6 bg-pastel-cream w-full p-4 sm:p-8 border-2 border-pastel-charcoal shadow-pixel relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Send size={100} />
      </div>
      <div>
        <label htmlFor="contact-name" className="block font-pixel text-lg mb-2 text-pastel-charcoal">Your Name</label>
        <input 
          id="contact-name"
          type="text" 
          required
          value={contactForm.name}
          onChange={e => setContactForm({...contactForm, name: e.target.value})}
          className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block font-pixel text-lg mb-2 text-pastel-charcoal">Email Address</label>
        <input 
          id="contact-email"
          type="email" 
          required
          value={contactForm.email}
          onChange={e => setContactForm({...contactForm, email: e.target.value})}
          className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
          placeholder="john@example.com"
        />
      </div>
        <div>
        <label htmlFor="contact-phone" className="block font-pixel text-lg mb-2 text-pastel-charcoal">Phone (Optional)</label>
        <input 
          id="contact-phone"
          type="tel" 
          value={contactForm.phone}
          onChange={e => setContactForm({...contactForm, phone: e.target.value})}
          className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
          placeholder="+1 234 567 890"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block font-pixel text-lg mb-2 text-pastel-charcoal">Project Details</label>
        <textarea 
          id="contact-message"
          required
          rows={4}
          value={contactForm.message}
          onChange={e => setContactForm({...contactForm, message: e.target.value})}
          className="w-full bg-pastel-surface border-2 border-pastel-charcoal p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus:shadow-pixel focus:border-pastel-blue transition-all text-base text-pastel-charcoal"
          placeholder="Tell me about your website needs..."
        />
      </div>
      <div className="relative z-10" aria-live="polite">
        {formStatus === 'success' ? (
            <div 
              className="animate-fade-in bg-pastel-mint border-2 border-pastel-charcoal p-4 text-center font-bold flex flex-col items-center justify-center gap-2 shadow-pixel w-full py-6 text-black"
              role="alert"
            >
              <span className="text-3xl bg-white rounded-full w-12 h-12 flex items-center justify-center border-2 border-pastel-charcoal">✓</span> 
              <span className="text-lg">Message Sent Successfully!</span>
              <span className="text-sm font-normal">I'll get back to you within 24 hours.</span>
            </div>
        ) : formStatus === 'error' ? (
            <div 
              className="animate-fade-in bg-red-200 border-2 border-pastel-charcoal p-4 text-center font-bold shadow-pixel w-full text-black"
              role="alert"
            >
              <span className="text-xl mr-2">⚠</span> {errorMessage || "Something went wrong. Please try again."}
            </div>
        ) : (
            <PixelButton type="submit" size="lg" className="w-full" isLoading={formStatus === 'submitting'}>
              Send Message
            </PixelButton>
        )}
      </div>
    </form>
  );
};

export default React.memo(ContactForm);
