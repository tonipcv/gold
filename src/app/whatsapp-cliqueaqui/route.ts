import { NextRequest, NextResponse } from 'next/server'

// Redirect to WhatsApp with prefilled message
// 73 9177-8075 => wa.me/557391778075
const WA_URL = 'https://wa.me/557391778075?text=Ol%C3%A1%2C%20sou%20aluno%20j%C3%A1%20salvei%20o%20contato%20de%20voc%C3%AAs%20e%20quero%20entrar%20na%20lista%20de%20transmiss%C3%A3o%21'

export async function GET(_req: NextRequest) {
  return NextResponse.redirect(WA_URL, { status: 302 })
}
