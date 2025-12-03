'use client'

import { useState } from 'react'
import ConsentModal from '@/components/ConsentModal'

export default function ConsentGate() {
  const [open, setOpen] = useState(true)

  const handleAccepted = async () => {
    try {
      // record consent server-side
      await fetch('/api/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentType: 'terms-of-use',
          text:
            'Ao prosseguir, declaro que:\n' +
            'compreendo que esta plataforma oferece apenas tecnologia de automação e não presta gestão, análise ou recomendação de investimentos;\n' +
            'reconheço que todas as ordens são executadas exclusivamente pela corretora, e que a empresa não acessa, controla ou movimenta minha conta de negociação;\n' +
            'tenho ciência de que operações financeiras envolvem risco elevado e posso perder parte ou todo o capital investido;\n' +
            'entendo que a escolha das estratégias e dos ativos a serem utilizados, bem como a definição de stop, risco, limites e demais parâmetros operacionais, será realizada exclusivamente por mim no momento da ativação;\n' +
            'declaro ainda que todas as configurações na minha conta da corretora são feitas por mim, sob minha total responsabilidade.\n' +
            'Leia os termos completos em test.k17.com.br/termos-de-uso.',
          textVersion: 'v3.0',
        }),
      })
    } catch (e) {
      console.error('Consent record failed', e)
    } finally {
      // reload the page to pass the server check
      window.location.reload()
    }
  }

  return (
    <ConsentModal
      open={open}
      onClose={() => setOpen(false)}
      onAccepted={handleAccepted}
      consentType="terms-of-use"
      hideTermsLink
      textVersion="v3.0"
      text={
        'Ao prosseguir, declaro que:\n' +
        'compreendo que esta plataforma oferece apenas tecnologia de automação e não presta gestão, análise ou recomendação de investimentos;\n' +
        'reconheço que todas as ordens são executadas exclusivamente pela corretora, e que a empresa não acessa, controla ou movimenta minha conta de negociação;\n' +
        'tenho ciência de que operações financeiras envolvem risco elevado e posso perder parte ou todo o capital investido;\n' +
        'entendo que a escolha das estratégias e dos ativos a serem utilizados, bem como a definição de stop, risco, limites e demais parâmetros operacionais, será realizada exclusivamente por mim no momento da ativação;\n' +
        'declaro ainda que todas as configurações na minha conta da corretora são feitas por mim, sob minha total responsabilidade.\n' +
        'Leia os termos completos em test.k17.com.br/termos-de-uso.'
      }
    />
  )
}
