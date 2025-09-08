import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    // TODO: implementar envio real de e-mail de acesso confirmado
    // Ex.: await sendAccessConfirmedEmail(email)

    return NextResponse.json({ message: `Se o email existir, reenviamos o acesso para ${email}.` })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 })
  }
}
