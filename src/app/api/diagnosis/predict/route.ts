import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const mlUrl = process.env.ML_SERVER_URL || process.env.NEXT_PUBLIC_ML_SERVER_URL
    if (!mlUrl) {
      return NextResponse.json({ error: 'ML_SERVER_URL not set' }, { status: 500 })
    }

    const res = await fetch(`${mlUrl.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.detail || 'ML error' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


