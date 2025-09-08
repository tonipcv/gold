import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Se quiser restringir apenas a admins, descomente e ajuste a role:
    // if ((session as any).user?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    // }

    let email: string | undefined
    try {
      const body = await req.json()
      email = body?.email
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Enviar e-mail real
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://gold.k17.com.br'
    const appLink = `${base}/automatizador-gold-10x`
    const passwordLink = `${base}/forgot-password`
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b0b0b">
        <h2 style="margin:0 0 10px 0">Bem-vindo(a) ao Automatizador Gold 10X</h2>
        <p>Seu <strong>primeiro acesso</strong> está pronto. Para entrar com segurança, siga os passos abaixo:</p>
        <ol style="padding-left:18px; margin:10px 0 16px">
          <li>Altere sua senha agora (recomendado para primeiro acesso).</li>
          <li>Depois, acesse o painel do Automatizador Gold 10X.</li>
        </ol>
        <p style="margin:12px 0">
          <a href="${passwordLink}" 
             style="display:inline-block;background:#111;color:#fff;border:1px solid #16a34a;text-decoration:none;padding:12px 16px;border-radius:8px;margin-right:8px">
            Alterar minha senha
          </a>
          <a href="${appLink}" 
             style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px">
            Acessar o Automatizador
          </a>
        </p>
        <p style="font-size:12px;color:#555;margin-top:12px">Se você não solicitou este acesso, ignore este e-mail.</p>
      </div>
    `

    const result = await sendEmail({
      to: email,
      subject: 'Acesso confirmado • Automatizador Gold 10X',
      html,
    })

    if ((result as any).skipped) {
      return NextResponse.json({
        message: `SMTP não configurado. Simulando reenvio para ${email}.`,
        skipped: true,
      })
    }

    if (!(result as any).success) {
      return NextResponse.json({ error: 'Falha ao enviar e-mail' }, { status: 500 })
    }

    return NextResponse.json({ message: `Enviamos a mensagem de primeiro acesso para ${email}.`, success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 })
  }
}
