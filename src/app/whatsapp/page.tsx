import { redirect } from 'next/navigation'

export default function WhatsAppRedirectPage() {
  // Redireciona para o WhatsApp do número +55 11 95807-2826
  redirect('https://wa.me/5511958072826')
}
