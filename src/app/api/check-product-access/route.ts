import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasProductAccess } from '@/lib/product-access'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ hasAccess: false }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const product = searchParams.get('product')
  
  if (!product) {
    return NextResponse.json({ hasAccess: false, error: 'Product parameter is required' }, { status: 400 })
  }

  try {
    const hasAccess = await hasProductAccess(product)
    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking product access:', error)
    return NextResponse.json({ hasAccess: false, error: 'Error checking product access' }, { status: 500 })
  }
}
