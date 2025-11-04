import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Basic health check for ML service
    return NextResponse.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'ml'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
