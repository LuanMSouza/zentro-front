'use client'

import DashBoard from '@/app/dashboard/page'
import { useEffect } from 'react';

export default function Home() {

  // 

  const trackAccess = () => {
    const params = new URLSearchParams(window.location.search);

    const payload = JSON.stringify({
      projeto_nome: 'Zentro',
      pagina_path: window.location.pathname,
      url_completa: window.location.href,
      referrer: document.referrer || 'direto',
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      largura_tela: window.innerWidth,
      idioma: navigator.language,
      user_agent: navigator.userAgent,
    });

    const url = "https://api.analitcs.dvls.com.br/api/track";

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
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
