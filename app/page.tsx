'use client'

import DashBoard from '@/app/dashboard/page'
import { useEffect } from 'react';

export default function Home() {

  // 

  const trackAccess = () => {
    const params = new URLSearchParams(window.location.search);

    const payload = JSON.stringify({
      // analytics único do painel de leads (aba Site DVLS do painel, site "Zentro")
      site: 'zentro',
      path: window.location.pathname,
      referrer: document.referrer || null,
      utmSource: params.get('utm_source') || null,
      utmMedium: params.get('utm_medium') || null,
    });

    const url = "https://api.leads.dvls.com.br/api/inbound/pageview";

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'text/plain' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'text/plain' },
        keepalive: true // Garante que a requisição termine mesmo se sair da página
      }).catch(() => { }); // Falha silenciosa
    }
  };

  useEffect(() => {
    trackAccess()
  }, [])

  // 

  return (
    <>
      <DashBoard />
    </>
  );
}
