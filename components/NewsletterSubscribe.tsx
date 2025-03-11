"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSubscribe() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error(t('newsletter.invalidEmail'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(t('newsletter.success'));
        setEmail('');
      } else {
        toast.error(data.message || t('newsletter.error'));
      }
    } catch (error) {
      toast.error(t('newsletter.error'));
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-white mb-3">{t('newsletter.title')}</h3>
      <p className="text-gray-400 text-sm mb-4">{t('newsletter.description')}</p>
      
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder')}
          className={`flex-grow bg-[#111] border border-[#333] rounded px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isRtl ? 'text-right' : 'text-left'}`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {isRtl ? (
                <>
                  {t('newsletter.subscribe')}
                  <Send size={16} className="ml-2" />
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  {t('newsletter.subscribe')}
                </>
              )}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
