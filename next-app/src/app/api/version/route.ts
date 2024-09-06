import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    version: '1.0.0',
    apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }

  return NextResponse.json(data, {
    status: 200,
  })
}
